import { Box, Chip, Paper, Stack, Typography } from '@mui/material'
import type { BuildingCourse } from '../domain/course'

export function CourseRoadmap({ course }: { course: BuildingCourse }) {
  return (
    <Paper sx={{ p: 2 }}>
      <Stack spacing={1.5}>
        <Box>
          <Typography variant="overline" color="text.secondary">
            Trilha do curso
          </Typography>
          <Typography variant="h6" fontWeight={800}>
            {course.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {course.description}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: 1.5,
            overflowX: 'auto',
            pb: 1,
            scrollSnapType: 'x proximity',
          }}
        >
          {course.chapters.map((chapter) => {
            const current = chapter.status === 'current'

            return (
              <Paper
                key={chapter.id}
                variant="outlined"
                sx={{
                  p: 1.5,
                  minWidth: 220,
                  maxWidth: 220,
                  opacity: current ? 1 : 0.58,
                  borderWidth: current ? 2 : 1,
                  scrollSnapAlign: 'start',
                }}
              >
                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between" gap={1}>
                    <Typography variant="caption" color="text.secondary">
                      {String(chapter.order).padStart(2, '0')}
                    </Typography>
                    <Chip
                      size="small"
                      variant={current ? 'filled' : 'outlined'}
                      label={current ? 'Agora' : 'Planejado'}
                    />
                  </Stack>

                  <Box>
                    <Typography fontWeight={800}>{chapter.title}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {chapter.survivalStage}
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary">
                    {chapter.subtitle}
                  </Typography>

                  <Stack direction="row" gap={0.5} flexWrap="wrap">
                    {chapter.skills.slice(0, 2).map((skill) => (
                      <Chip key={skill} size="small" variant="outlined" label={skill} />
                    ))}
                  </Stack>
                </Stack>
              </Paper>
            )
          })}
        </Box>
      </Stack>
    </Paper>
  )
}
