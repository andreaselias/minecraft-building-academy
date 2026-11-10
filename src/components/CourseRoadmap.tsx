import {
  Box,
  ButtonBase,
  Chip,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import type { BuildingCourse } from '../domain/course'

interface CourseRoadmapProps {
  course: BuildingCourse
  activeBlueprintId: string
  unlockedBlueprintIds: Set<string>
  completedBlueprintIds: Set<string>
  onSelectBlueprint: (blueprintId: string) => void
}

export function CourseRoadmap({
  course,
  activeBlueprintId,
  unlockedBlueprintIds,
  completedBlueprintIds,
  onSelectBlueprint,
}: CourseRoadmapProps) {
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
            const blueprintId = chapter.blueprintId
            const current = blueprintId === activeBlueprintId
            const completed = Boolean(
              blueprintId && completedBlueprintIds.has(blueprintId),
            )
            const unlocked = Boolean(
              blueprintId && unlockedBlueprintIds.has(blueprintId),
            )

            const statusLabel = current
              ? 'Agora'
              : completed
                ? 'Concluído'
                : unlocked
                  ? 'Disponível'
                  : 'Planejado'

            const card = (
              <Paper
                variant="outlined"
                sx={{
                  p: 1.5,
                  minWidth: 220,
                  maxWidth: 220,
                  minHeight: 176,
                  opacity: current || unlocked || completed ? 1 : 0.5,
                  borderWidth: current ? 2 : 1,
                  textAlign: 'left',
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
                      variant={current || completed ? 'filled' : 'outlined'}
                      label={statusLabel}
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

            if (!blueprintId || !unlocked) {
              return <Box key={chapter.id}>{card}</Box>
            }

            return (
              <ButtonBase
                key={chapter.id}
                onClick={() => onSelectBlueprint(blueprintId)}
                sx={{ borderRadius: 1, alignItems: 'stretch' }}
              >
                {card}
              </ButtonBase>
            )
          })}
        </Box>
      </Stack>
    </Paper>
  )
}
