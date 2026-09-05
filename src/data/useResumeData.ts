import resumeJson from '../../public/resume.json'
import type { ResumeData } from './resumeSchema'

const data = resumeJson as ResumeData

export function useResumeData(): ResumeData {
  return data
}
