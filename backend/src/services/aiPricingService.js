const OpenAI = require('openai');

class AIPricingService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  /**
   * Calculate fair pay for makers based on multiple factors
   * @param {Object} params - Pricing parameters
   * @param {number} params.retailPrice - Final retail price of the product
   * @param {number} params.materialCost - Cost of materials per piece
   * @param {number} params.desiredProfitMargin - Owner's desired profit margin (0-1)
   * @param {string} params.taskDescription - Description of the crafting task
   * @param {number} params.quantity - Number of pieces to be made
   * @param {number} params.estimatedTimePerPiece - Estimated time in minutes
   * @param {string} params.complexityLevel - 'beginner', 'intermediate', or 'advanced'
   * @param {string} params.makerTier - 'beginner', 'intermediate', or 'pro'
   * @returns {Promise<Object>} Pricing recommendation
   */
  async calculateFairPay(params) {
    const {
      retailPrice,
      materialCost,
      desiredProfitMargin = 0.3,
      taskDescription,
      quantity = 1,
      estimatedTimePerPiece = 30,
      complexityLevel = 'intermediate',
      makerTier = 'beginner'
    } = params;

    // Base calculation
    const baseCalculation = this._calculateBasePricing({
      retailPrice,
      materialCost,
      desiredProfitMargin,
      estimatedTimePerPiece,
      complexityLevel,
      makerTier
    });

    // Use AI to refine and validate pricing
    const aiRefinedPricing = await this._getAIRefinedPricing({
      ...params,
      baseCalculation
    });

    return {
      ...baseCalculation,
      aiRecommendations: aiRefinedPricing,
      metadata: {
        calculatedAt: new Date().toISOString(),
        version: '1.0',
        model: 'gpt-4-turbo-preview'
      }
    };
  }

  /**
   * Calculate base pricing using algorithmic approach
   */
  _calculateBasePricing(params) {
    const {
      retailPrice,
      materialCost,
      desiredProfitMargin,
      estimatedTimePerPiece,
      complexityLevel,
      makerTier
    } = params;

    // Complexity multipliers
    const complexityMultipliers = {
      beginner: 1.0,
      intermediate: 1.3,
      advanced: 1.6
    };

    // Tier multipliers (makers with higher ratings earn more)
    const tierMultipliers = {
      beginner: 1.0,
      intermediate: 1.15,
      pro: 1.35
    };

    // Calculate hourly rate based on complexity (fair minimum wages)
    const baseHourlyRates = {
      beginner: 15,
      intermediate: 20,
      advanced: 25
    };

    const baseHourlyRate = baseHourlyRates[complexityLevel] || 20;
    const complexityMultiplier = complexityMultipliers[complexityLevel] || 1.3;
    const tierMultiplier = tierMultipliers[makerTier] || 1.0;

    // Calculate time-based pay
    const timeInHours = estimatedTimePerPiece / 60;
    const timeBasedPay = baseHourlyRate * timeInHours * complexityMultiplier * tierMultiplier;

    // Calculate value-based pay (percentage of retail after materials and owner profit)
    const ownerProfit = retailPrice * desiredProfitMargin;
    const remainingValue = retailPrice - materialCost - ownerProfit;
    const valueBasedPay = Math.max(remainingValue * 0.6, 0); // Maker gets 60% of remaining value

    // Take the higher of time-based or value-based pay
    const recommendedPayPerPiece = Math.max(timeBasedPay, valueBasedPay);

    // Calculate business owner's actual profit
    const ownerActualProfit = retailPrice - materialCost - recommendedPayPerPiece;
    const ownerProfitMargin = ownerActualProfit / retailPrice;

    // Calculate maker's effective hourly rate
    const makerHourlyRate = recommendedPayPerPiece / timeInHours;

    // Feasibility check
    const isFeasible = ownerActualProfit > 0 && recommendedPayPerPiece >= 5;

    return {
      recommendedPayPerPiece: Math.round(recommendedPayPerPiece * 100) / 100,
      makerHourlyRate: Math.round(makerHourlyRate * 100) / 100,
      ownerProfit: Math.round(ownerActualProfit * 100) / 100,
      ownerProfitMargin: Math.round(ownerProfitMargin * 1000) / 10, // percentage
      isFeasible,
      breakdown: {
        retailPrice,
        materialCost,
        laborCost: recommendedPayPerPiece,
        ownerProfit: ownerActualProfit,
        calculationMethod: timeBasedPay > valueBasedPay ? 'time-based' : 'value-based'
      },
      recommendations: this._generateRecommendations({
        isFeasible,
        ownerProfitMargin,
        makerHourlyRate,
        desiredProfitMargin
      })
    };
  }

  /**
   * Use OpenAI to provide contextual pricing insights
   */
  async _getAIRefinedPricing(params) {
    const {
      taskDescription,
      baseCalculation,
      retailPrice,
      materialCost,
      complexityLevel,
      estimatedTimePerPiece
    } = params;

    try {
      const prompt = `You are a pricing expert for a handmade crafts marketplace. Analyze this crafting task and provide pricing insights:

Task: ${taskDescription}
Retail Price: $${retailPrice}
Material Cost: $${materialCost}
Complexity: ${complexityLevel}
Estimated Time: ${estimatedTimePerPiece} minutes

Current Base Calculation:
- Recommended Pay Per Piece: $${baseCalculation.recommendedPayPerPiece}
- Maker Hourly Rate: $${baseCalculation.makerHourlyRate}/hour
- Owner Profit: $${baseCalculation.ownerProfit}
- Owner Profit Margin: ${baseCalculation.ownerProfitMargin}%

Please provide:
1. Assessment of whether this pricing is fair for both maker and business owner
2. Market comparison (is this competitive for handmade crafts?)
3. Specific suggestions for optimization
4. Any red flags or concerns
5. Alternative pricing structures to consider

Respond in JSON format with keys: assessment, marketComparison, suggestions, concerns, alternatives`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'You are an expert in pricing handmade products and ensuring fair compensation for craft workers while maintaining business viability. Respond only with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      });

      const aiInsights = JSON.parse(completion.choices[0].message.content);
      return aiInsights;
    } catch (error) {
      console.error('AI pricing refinement error:', error.message);
      return {
        assessment: 'AI analysis unavailable',
        marketComparison: 'Unable to provide market comparison',
        suggestions: ['Use base calculation as reference'],
        concerns: [],
        alternatives: []
      };
    }
  }

  /**
   * Generate actionable recommendations based on calculation
   */
  _generateRecommendations(params) {
    const { isFeasible, ownerProfitMargin, makerHourlyRate, desiredProfitMargin } = params;
    const recommendations = [];

    if (!isFeasible) {
      recommendations.push({
        type: 'critical',
        message: 'This pricing structure is not feasible. Consider increasing retail price or reducing material costs.'
      });
    }

    if (ownerProfitMargin < desiredProfitMargin * 100) {
      recommendations.push({
        type: 'warning',
        message: `Owner profit margin (${ownerProfitMargin.toFixed(1)}%) is below desired margin. Consider adjusting pricing or finding more cost-effective materials.`
      });
    }

    if (makerHourlyRate < 15) {
      recommendations.push({
        type: 'warning',
        message: `Maker hourly rate ($${makerHourlyRate.toFixed(2)}/hr) is below fair minimum. Consider increasing pay or reducing task complexity.`
      });
    }

    if (makerHourlyRate >= 15 && makerHourlyRate <= 25 && ownerProfitMargin >= 20) {
      recommendations.push({
        type: 'success',
        message: 'This pricing provides fair compensation for makers while maintaining healthy business margins.'
      });
    }

    if (ownerProfitMargin > 50) {
      recommendations.push({
        type: 'info',
        message: 'High profit margin detected. Consider increasing maker pay to improve retention and quality.'
      });
    }

    return recommendations;
  }

  /**
   * Calculate batch pricing with volume discounts
   */
  async calculateBatchPricing(params, quantities = [1, 5, 10, 25, 50]) {
    const basePricing = await this.calculateFairPay(params);
    
    const batchPricing = quantities.map(qty => {
      // Volume discount: small reduction for larger batches
      const volumeDiscount = Math.min(0.15, (qty - 1) * 0.01); // Max 15% discount
      const discountedPrice = basePricing.recommendedPayPerPiece * (1 - volumeDiscount);
      
      return {
        quantity: qty,
        pricePerPiece: Math.round(discountedPrice * 100) / 100,
        totalPay: Math.round(discountedPrice * qty * 100) / 100,
        discount: Math.round(volumeDiscount * 100)
      };
    });

    return {
      basePricing,
      batchOptions: batchPricing
    };
  }

  /**
   * Suggest optimal pricing for maximum maker engagement
   */
  async suggestOptimalPricing(params) {
    const currentPricing = await this.calculateFairPay(params);
    
    // Calculate 3 pricing tiers
    const conservative = {
      ...params,
      desiredProfitMargin: params.desiredProfitMargin * 1.2
    };
    
    const balanced = params;
    
    const generous = {
      ...params,
      desiredProfitMargin: params.desiredProfitMargin * 0.8
    };

    const [conservativePricing, balancedPricing, generousPricing] = await Promise.all([
      this.calculateFairPay(conservative),
      this.calculateFairPay(balanced),
      this.calculateFairPay(generous)
    ]);

    return {
      conservative: {
        ...conservativePricing,
        description: 'Prioritizes business profit, may attract fewer makers'
      },
      balanced: {
        ...balancedPricing,
        description: 'Balanced approach for sustainable growth'
      },
      generous: {
        ...generousPricing,
        description: 'Prioritizes maker satisfaction, builds loyalty'
      },
      recommendation: 'balanced'
    };
  }
}

module.exports = new AIPricingService();
