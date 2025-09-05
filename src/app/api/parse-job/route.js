// src/app/api/parse-job/route.js
import { NextResponse } from 'next/server';

// Mock data generator
function generateMockJobData(jobTitle, jdText) {
  const locations = ['Remote', 'New York, NY', 'San Francisco, CA', 'Austin, TX', 'London, UK'];
  const companies = ['TechCorp', 'InnovateLabs', 'DataSystems', 'CloudSolutions', 'NextGen Tech'];
  const skills = ['React', 'Node.js', 'Python', 'AWS', 'TypeScript', 'MongoDB', 'PostgreSQL'];
  
  // Extract some skills from JD text if provided
  const extractedSkills = jdText 
    ? skills.filter(skill => jdText.toLowerCase().includes(skill.toLowerCase()))
    : [];
  
  return {
    location: locations[Math.floor(Math.random() * locations.length)],
    employmentType: ['full_time', 'part_time', 'internship'][Math.floor(Math.random() * 3)],
    workMode: ['remote', 'hybrid', 'onsite'][Math.floor(Math.random() * 3)],
    companyName: companies[Math.floor(Math.random() * companies.length)],
    skillsRequired: extractedSkills.length > 0 ? extractedSkills : skills.slice(0, 3),
    jdSummary: jdText 
      ? `Summary: ${jdText.substring(0, 200)}...` 
      : 'Job description summary will appear here'
  };
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const jobTitle = formData.get('jobTitle');
    const jdFile = formData.get('jdFile');
    const jdText = formData.get('jdText');

    // Simulate API processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    let jdContent = jdText;
    
    // If file was uploaded, simulate text extraction
    if (jdFile && jdFile instanceof File) {
      jdContent = `Extracted text from ${jdFile.name}: This is a simulated text extraction from the uploaded JD file. The position requires strong technical skills and experience.`;
    }

    const parsedData = generateMockJobData(jobTitle, jdContent);

    return NextResponse.json({
      success: true,
      data: parsedData,
      rawText: jdContent
    });

  } catch (error) {
    console.error('Error parsing job:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to parse job description' },
      { status: 500 }
    );
  }
}