import { PopulationSurvey } from '../types';

export const calculateStrategicQuota = (
    latestSurvey: PopulationSurvey,
    targetPopulation: number,
    growthRate: number,
    targetRatioMale: number,
    targetRatioFemale: number
): { total: number; males: number | 'N/A'; females: number | 'N/A' } => {
    if (!latestSurvey || growthRate <= 0 || targetPopulation < 0) {
        return { total: 0, males: 0, females: 0 };
    }

    const N_t = latestSurvey.estimatedCount;
    const lambda = growthRate;
    const K = targetPopulation;

    // Sustainable yield calculation
    const H = Math.round(N_t * lambda - K);
    if (H <= 0) {
        return { total: 0, males: 0, females: 0 };
    }

    const N_m = latestSurvey.maleCount || 0;
    const N_f = latestSurvey.femaleCount || 0;

    // If no demographic data, return total only
    if (N_m === 0 || N_f === 0 || targetRatioMale <= 0 || targetRatioFemale <= 0) {
        return { total: H, males: 'N/A', females: 'N/A' };
    }
    
    // Desired post-harvest ratio
    const R = targetRatioFemale / targetRatioMale;
    
    // Formula to determine number of males to harvest to achieve target ratio
    let H_m = (R * N_m - N_f + H) / (1 + R);
    H_m = Math.round(Math.max(0, Math.min(N_m, H_m)));
    
    let H_f = H - H_m;
    
    // Adjust if female harvest exceeds available females
    if (H_f < 0) {
        H_f = 0;
        H_m = H;
    }
    if (H_f > N_f) {
        H_f = N_f;
        H_m = H - N_f;
    }
    
    // Final check to ensure male harvest doesn't exceed available males
    H_m = Math.max(0, Math.min(N_m, H_m));

    return { total: H, males: H_m, females: H_f };
};
