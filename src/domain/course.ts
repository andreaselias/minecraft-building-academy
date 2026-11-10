export type CourseChapterStatus = 'current' | 'planned'

export interface CourseChapter {
  id: string
  order: number
  title: string
  subtitle: string
  survivalStage: string
  status: CourseChapterStatus
  skills: string[]
  blueprintId?: string
}

export interface BuildingCourse {
  id: string
  title: string
  description: string
  chapters: CourseChapter[]
}
