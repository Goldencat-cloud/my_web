export interface LocalizedString {
  en: string
  zh?: string
}

export interface ResumeMeta {
  version: string
  updatedAt: string
  sourceLang: 'zh' | 'en'
}

export interface Stat {
  value: string
  label: LocalizedString
}

export interface Pill {
  label: LocalizedString
  note?: LocalizedString
  full?: LocalizedString
}

export interface AboutHeader {
  title: LocalizedString
  atmosphere: LocalizedString
}

export interface EducationItem {
  time: LocalizedString
  school: LocalizedString
  degree: LocalizedString
  gpa?: number
  inProgress?: boolean
}

export interface CourseItem {
  name: LocalizedString
  score: number
}

export interface AboutSectionData {
  header: AboutHeader
  mbti: string
  personalityTags: LocalizedString
  bio: LocalizedString
  avatar: {
    src: string
    alt?: LocalizedString
  }
  education: EducationItem[]
  courses: {
    title: LocalizedString
    items: CourseItem[]
  }
}

export interface InternshipAct {
  no: string
  title: LocalizedString
  short: string
  file: string
  body: LocalizedString
  stats: Stat[]
}

export interface InternshipSectionData {
  header: {
    title: LocalizedString
    subtitle: LocalizedString
  }
  company: LocalizedString
  department: LocalizedString
  role: LocalizedString
  period: LocalizedString
  acts: InternshipAct[]
}

export interface AwardItem {
  level: 'national' | 'provincial' | 'university'
  name: LocalizedString
  tier: LocalizedString
  role?: LocalizedString
  duty: LocalizedString
}

export interface AwardsSectionData {
  header: {
    title: LocalizedString
    stats: Stat[]
  }
  scholarships: Pill[]
  certificates: Pill[]
  languages: Pill[]
  items: AwardItem[]
}

export interface ProjectStage {
  key: string
  label: LocalizedString
  body: LocalizedString
}

export interface Project {
  id: string
  year: string
  no: string
  tab: LocalizedString
  title: LocalizedString
  subtitle?: LocalizedString
  honor?: LocalizedString
  time: LocalizedString
  role: LocalizedString
  tech: LocalizedString[]
  stages: ProjectStage[]
}

export interface CampusRole {
  idx: string
  title: LocalizedString
  org: LocalizedString
  time: LocalizedString
  duties: LocalizedString[]
  chips: LocalizedString[]
}

export interface CampusSectionData {
  header: {
    title: LocalizedString
    subtitle: LocalizedString
  }
  roles: CampusRole[]
  volunteer: {
    value: string
    unit: LocalizedString
    label: LocalizedString
  }
  stamp: {
    org: string
    year: string
    emblem: string
  }
}

export interface LearningSectionData {
  header: {
    title: LocalizedString
    subtitle: LocalizedString
  }
}

export interface ResumeData {
  meta: ResumeMeta
  about: AboutSectionData
  internship: InternshipSectionData
  awards: AwardsSectionData
  projects: Project[]
  campus: CampusSectionData
  learning: LearningSectionData
}
