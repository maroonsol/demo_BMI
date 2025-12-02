export interface HealthData {
  name: string;
  date: string;
  age: number;
  gender: 'male' | 'female';
  height: number;
  phone: string;
  email: string;
  weight: number;
  bodyFat: number;
  visceralFat: number;
  bmr: number;
  bmi: number;
  bodyAge: number;
  subcutaneousFat: number;
  skeletalMuscle: number;
}

export function getBMICategory(bmi: number): { category: string; details: string; color: string } {
  if (bmi < 18) {
    return {
      category: 'Malnutrition 2',
      details: 'Anorexia, Bulimia, Osteoporosis and Break Down of Muscle mass etc.',
      color: '#ef4444' // red
    };
  } else if (bmi >= 18 && bmi < 20) {
    return {
      category: 'Malnutrition 1',
      details: 'Anorexia, Bulimia, Osteoporosis and Break Down of Muscle mass etc.',
      color: '#f97316' // orange
    };
  } else if (bmi >= 20 && bmi < 23) {
    return {
      category: 'Normal',
      details: 'Normal mensuration, can handle stress, good energy levels, vitality, resistance to illness, good physical condition etc.',
      color: '#22c55e' // green
    };
  } else if (bmi >= 23 && bmi < 25) {
    return {
      category: 'Overweight',
      details: 'Fatigue, digestive problems, circulation problems, varicose veins etc.',
      color: '#f97316' // orange
    };
  } else if (bmi >= 25 && bmi < 28) {
    return {
      category: 'Obesity grade 1',
      details: 'Diabetes, hypertension, cardiovascular diseases, blood clots, stroke, joint problems/arthritis in knee, spine etc.',
      color: '#f97316' // orange
    };
  } else if (bmi >= 28 && bmi < 30) {
    return {
      category: 'Obesity grade 2',
      details: 'Diabetes, cancer, angina, heart attacks, arteriolosclerosis & strokes etc.',
      color: '#ef4444' // red
    };
  } else {
    return {
      category: 'Obesity grade 3',
      details: 'Maximum risk of diabetes, cancer, heart disease.',
      color: '#ef4444' // red
    };
  }
}

export function getBodyFatStatus(bodyFat: number, gender: 'male' | 'female'): { status: string; color: string } {
  if (gender === 'male') {
    if (bodyFat >= 10 && bodyFat <= 20) {
      return { status: 'Normal', color: '#22c55e' };
    } else if (bodyFat >= 21 && bodyFat <= 25) {
      return { status: 'High', color: '#f97316' };
    } else {
      return { status: 'Risk', color: '#ef4444' };
    }
  } else {
    if (bodyFat >= 20 && bodyFat <= 30) {
      return { status: 'Normal', color: '#22c55e' };
    } else if (bodyFat >= 31 && bodyFat <= 35) {
      return { status: 'High', color: '#f97316' };
    } else {
      return { status: 'Risk', color: '#ef4444' };
    }
  }
}

export function getVisceralFatStatus(visceralFat: number): { status: string; color: string } {
  if (visceralFat >= 2 && visceralFat <= 8) {
    return { status: 'Normal', color: '#22c55e' };
  } else if (visceralFat >= 9 && visceralFat <= 14) {
    return { status: 'High', color: '#f97316' };
  } else {
    return { status: 'Risk', color: '#ef4444' };
  }
}

export function getSubcutaneousFatStatus(subcutaneousFat: number): { status: string; color: string } {
  if (subcutaneousFat < 15) {
    return { status: 'Normal', color: '#22c55e' };
  } else {
    return { status: 'High', color: '#f97316' };
  }
}

export function getSkeletalMuscleStatus(skeletalMuscle: number, gender: 'male' | 'female'): { status: string; color: string } {
  if (gender === 'male') {
    if (skeletalMuscle >= 33 && skeletalMuscle <= 36) {
      return { status: 'Normal', color: '#22c55e' };
    } else {
      return { status: 'Abnormal', color: '#f97316' };
    }
  } else {
    if (skeletalMuscle >= 30 && skeletalMuscle <= 33) {
      return { status: 'Normal', color: '#22c55e' };
    } else {
      return { status: 'Abnormal', color: '#f97316' };
    }
  }
}

export function getBMRStatus(bmr: number, gender: 'male' | 'female'): { status: string; color: string } {
  const expectedBMR = gender === 'male' ? 1800 : 1600;
  const diff = Math.abs(bmr - expectedBMR);
  const percentage = (diff / expectedBMR) * 100;
  
  if (percentage <= 10) {
    return { status: 'Normal', color: '#22c55e' };
  } else if (percentage <= 20) {
    return { status: 'Slightly Abnormal', color: '#f97316' };
  } else {
    return { status: 'Abnormal', color: '#ef4444' };
  }
}

/**
 * Generates the HTML content for the health report PDF
 * This function can be used both client-side and server-side
 */
export function generateReportHTML(data: HealthData): string {
  const bmiCategory = getBMICategory(data.bmi);
  const bodyFatStatus = getBodyFatStatus(data.bodyFat, data.gender);
  const visceralFatStatus = getVisceralFatStatus(data.visceralFat);
  const subcutaneousFatStatus = getSubcutaneousFatStatus(data.subcutaneousFat);
  const skeletalMuscleStatus = getSkeletalMuscleStatus(data.skeletalMuscle, data.gender);
  const bmrStatus = getBMRStatus(data.bmr, data.gender);

  return `
    <div style="width: 794px; min-height: 1123px; padding: 20px; background-color: rgb(255, 255, 255); font-family: Arial, sans-serif; color: rgb(0, 0, 0); margin: 0; box-sizing: border-box;">
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        color: inherit;
      }
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      }
      .header {
        background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
        padding: 30px 25px;
        border-radius: 16px 16px 0 0;
        margin-bottom: 25px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      .logo-section {
        display: flex;
        align-items: center;
        gap: 20px;
      }
      .company-info {
        flex: 1;
      }
      .company-name {
        font-size: 32px;
        font-weight: 700;
        color: rgb(255, 255, 255) !important;
        margin-bottom: 8px;
        letter-spacing: -0.5px;
      }
      .company-details {
        font-size: 13px;
        color: rgba(255, 255, 255, 0.9) !important;
        line-height: 1.8;
      }
      .report-title {
        text-align: center;
        font-size: 28px;
        font-weight: 700;
        color: rgb(15, 23, 42) !important;
        margin: 35px 0;
        letter-spacing: -0.5px;
      }
      .section-container {
        margin-bottom: 25px;
      }
      .section-title {
        font-size: 20px;
        font-weight: 700;
        color: rgb(15, 23, 42) !important;
        margin-bottom: 18px;
        padding-left: 8px;
        border-left: 5px solid #2563eb;
        letter-spacing: -0.3px;
      }
      .patient-info {
        background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        padding: 25px;
        border-radius: 16px;
        margin-bottom: 30px;
        border: 1px solid rgba(226, 232, 240, 0.8);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      }
      .info-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 18px;
      }
      .info-item {
        background: rgb(255, 255, 255);
        padding: 14px 18px;
        border-radius: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: 1px solid rgba(226, 232, 240, 0.6);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      }
      .info-label {
        font-weight: 600;
        color: rgb(71, 85, 105) !important;
        font-size: 14px;
      }
      .info-value {
        color: rgb(15, 23, 42) !important;
        font-weight: 600;
        font-size: 14px;
      }
      .metrics-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 18px;
        margin-bottom: 20px;
      }
      .metric-card {
        background: rgb(255, 255, 255) !important;
        border: 2px solid rgba(226, 232, 240, 0.8) !important;
        border-radius: 16px;
        padding: 20px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }
      .metric-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #2563eb, #3b82f6);
      }
      .metric-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 12px;
        gap: 15px;
      }
      .metric-name {
        font-size: 15px;
        font-weight: 600;
        color: rgb(51, 65, 85) !important;
        line-height: 1.4;
        flex: 1;
      }
      .metric-value-container {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 6px;
      }
      .metric-value {
        font-size: 24px;
        font-weight: 700;
        line-height: 1;
      }
      .metric-status {
        display: inline-block;
        padding: 6px 14px;
        border-radius: 20px;
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .metric-details {
        font-size: 12px;
        color: rgb(100, 116, 139) !important;
        margin-top: 12px;
        line-height: 1.6;
        padding-top: 12px;
        border-top: 1px solid rgba(226, 232, 240, 0.6);
      }
      .bmi-details {
        background: linear-gradient(135deg, rgba(254, 243, 199, 0.6) 0%, rgba(253, 230, 138, 0.4) 100%);
        padding: 14px;
        border-radius: 12px;
        margin-top: 12px;
        border-left: 4px solid ${bmiCategory.color} !important;
        border: 1px solid rgba(254, 243, 199, 0.8);
      }
      .bmi-details strong {
        color: rgb(51, 65, 85) !important;
        font-size: 12px;
      }
      .basic-metrics {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 18px;
        margin-top: 20px;
      }
      .basic-metric-card {
        background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
        border: 2px solid rgba(226, 232, 240, 0.8);
        border-radius: 16px;
        padding: 18px;
        text-align: center;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      }
      .basic-metric-label {
        font-size: 13px;
        color: rgb(100, 116, 139) !important;
        font-weight: 600;
        margin-bottom: 8px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .basic-metric-value {
        font-size: 28px;
        font-weight: 700;
        color: rgb(15, 23, 42) !important;
      }
      .footer {
        margin-top: 50px;
        padding: 25px;
        background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
        border-radius: 16px;
        text-align: center;
        font-size: 12px;
        color: rgb(100, 116, 139) !important;
        border: 1px solid rgba(226, 232, 240, 0.8);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      }
      .footer p {
        margin: 6px 0;
        line-height: 1.6;
      }
    </style>
    <div class="header">
      <div class="logo-section">
        <div class="company-info">
          <div class="company-name">Health Assessment Center</div>
          <div class="company-details">
            123 Medical Street, Health City, HC 12345<br>
            Phone: +1 (555) 123-4567 | Email: info@healthassessment.com<br>
            Website: www.healthassessment.com
          </div>
        </div>
      </div>
    </div>

    <div class="report-title">Health Assessment Report</div>

    <div class="section-container">
      <div class="section-title">Patient Information</div>
      <div class="patient-info">
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Name:</span>
            <span class="info-value">${data.name}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Date:</span>
            <span class="info-value">${data.date}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Age:</span>
            <span class="info-value">${data.age} years</span>
          </div>
          <div class="info-item">
            <span class="info-label">Gender:</span>
            <span class="info-value">${data.gender.charAt(0).toUpperCase() + data.gender.slice(1)}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Phone:</span>
            <span class="info-value">${data.phone}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Email:</span>
            <span class="info-value">${data.email}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="section-container">
      <div class="section-title">Body Composition Analysis</div>
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-header">
            <div class="metric-name">BMI (Body Mass Index)</div>
            <div class="metric-value-container">
              <div class="metric-value" style="color: ${bmiCategory.color}">${data.bmi.toFixed(1)}</div>
              <div class="metric-status" style="background: ${bmiCategory.color}20; color: ${bmiCategory.color}">
                ${bmiCategory.category}
              </div>
            </div>
          </div>
          <div class="bmi-details">
            <strong>Details:</strong> ${bmiCategory.details}
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <div class="metric-name">Body Fat (%)</div>
            <div class="metric-value-container">
              <div class="metric-value" style="color: ${bodyFatStatus.color}">${data.bodyFat}%</div>
              <div class="metric-status" style="background: ${bodyFatStatus.color}20; color: ${bodyFatStatus.color}">
                ${bodyFatStatus.status}
              </div>
            </div>
          </div>
          <div class="metric-details">
            Normal Range: ${data.gender === 'male' ? '10-20%' : '20-30%'} | 
            High: ${data.gender === 'male' ? '21-25%' : '31-35%'} | 
            Risk: ${data.gender === 'male' ? '25%+' : '35%+'}
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <div class="metric-name">Visceral Fat</div>
            <div class="metric-value-container">
              <div class="metric-value" style="color: ${visceralFatStatus.color}">${data.visceralFat}</div>
              <div class="metric-status" style="background: ${visceralFatStatus.color}20; color: ${visceralFatStatus.color}">
                ${visceralFatStatus.status}
              </div>
            </div>
          </div>
          <div class="metric-details">
            Normal: 2-8 | High: 9-14 | Risk: 15+
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <div class="metric-name">Subcutaneous Fat (%)</div>
            <div class="metric-value-container">
              <div class="metric-value" style="color: ${subcutaneousFatStatus.color}">${data.subcutaneousFat}%</div>
              <div class="metric-status" style="background: ${subcutaneousFatStatus.color}20; color: ${subcutaneousFatStatus.color}">
                ${subcutaneousFatStatus.status}
              </div>
            </div>
          </div>
          <div class="metric-details">
            Fat found just below the skin. Ideal range: &lt; 15%
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <div class="metric-name">Skeletal Muscle (%)</div>
            <div class="metric-value-container">
              <div class="metric-value" style="color: ${skeletalMuscleStatus.color}">${data.skeletalMuscle}%</div>
              <div class="metric-status" style="background: ${skeletalMuscleStatus.color}20; color: ${skeletalMuscleStatus.color}">
                ${skeletalMuscleStatus.status}
              </div>
            </div>
          </div>
          <div class="metric-details">
            Normal Range: ${data.gender === 'male' ? '33-36%' : '30-33%'}
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <div class="metric-name">BMR (Basal Metabolic Rate)</div>
            <div class="metric-value-container">
              <div class="metric-value" style="color: ${bmrStatus.color}">${data.bmr}</div>
              <div class="metric-status" style="background: ${bmrStatus.color}20; color: ${bmrStatus.color}">
                ${bmrStatus.status}
              </div>
            </div>
          </div>
          <div class="metric-details">
            Expected Range: ${data.gender === 'male' ? '~1800 kcal/day' : '~1600 kcal/day'}
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-header">
            <div class="metric-name">Body Age</div>
            <div class="metric-value-container">
              <div class="metric-value" style="color: ${data.bodyAge <= data.age ? '#22c55e' : '#f97316'}">${data.bodyAge}</div>
              <div class="metric-status" style="background: ${data.bodyAge <= data.age ? '#22c55e20' : '#f9731620'}; color: ${data.bodyAge <= data.age ? '#22c55e' : '#f97316'}">
                ${data.bodyAge <= data.age ? 'Good' : 'Needs Improvement'}
              </div>
            </div>
          </div>
          <div class="metric-details">
            Your body age compared to your chronological age of ${data.age} years
          </div>
        </div>
      </div>
    </div>

    <div class="section-container">
      <div class="section-title">Basic Measurements</div>
      <div class="basic-metrics">
        <div class="basic-metric-card">
          <div class="basic-metric-label">Height</div>
          <div class="basic-metric-value">${data.height} cm</div>
        </div>
        <div class="basic-metric-card">
          <div class="basic-metric-label">Weight</div>
          <div class="basic-metric-value">${data.weight} kg</div>
        </div>
      </div>
    </div>

    <div class="footer">
      <p><strong>Report Generated:</strong> ${new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}</p>
      <p>For any queries, please contact us at info@healthassessment.com</p>
    </div>
    </div>
  `;
}

/**
 * Client-side function to generate PDF via API route
 * This replaces the old client-side PDF generation
 */
export async function generatePDFReport(data: HealthData): Promise<void> {
  try {
    const response = await fetch('/api/generate-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to generate PDF: ${response.statusText}`);
    }

    // Get the PDF blob and trigger download
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Health_Report_${data.name.replace(/\s+/g, '_')}_${data.date.replace(/\s+/g, '_')}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF. Please try again.');
    throw error;
  }
}

