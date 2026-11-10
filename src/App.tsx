import { useMemo, useState } from 'react'
import { Box, Chip, Container, Divider, Paper, Slider, Stack, Typography } from '@mui/material'
import { starterHouse } from './data/starter-house'

export default function App() {
  const [layer, setLayer] = useState(0)
  const maxLayer = useMemo(() => Math.max(...starterHouse.blocks.map((block) => block.y)), [])
  const visibleBlocks = useMemo(() => starterHouse.blocks.filter((block) => block.y === layer), [layer])

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="overline" color="text.secondary">Minecraft Building Academy · Bedrock</Typography>
          <Typography variant="h3" fontWeight={800}>{starterHouse.title}</Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
            <Chip label={starterHouse.style} />
            <Chip label="Survival · início de jogo" />
            <Chip label={starterHouse.size.width + '×' + starterHouse.size.depth + '×' + starterHouse.size.height} />
          </Stack>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '280px 1fr 320px' }, gap: 2 }}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Aprendizado</Typography>
            <Divider sx={{ my: 1.5 }} />
            <Stack spacing={2}>
              {starterHouse.lessons.map((lesson) => (
                <Box key={lesson.id}>
                  <Typography fontWeight={700}>{lesson.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{lesson.explanation}</Typography>
                </Box>
              ))}
            </Stack>
          </Paper>

          <Paper sx={{ minHeight: 520, p: 3, display: 'grid', placeItems: 'center', textAlign: 'center' }}>
            <Box>
              <Typography variant="h5" fontWeight={700}>Visualizador 3D</Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>A cena Three.js entra no próximo passo.</Typography>
              <Typography variant="h2" sx={{ my: 4 }}>{visibleBlocks.length}</Typography>
              <Typography>blocos na camada {layer}</Typography>
            </Box>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Materiais</Typography>
            <Divider sx={{ my: 1.5 }} />
            <Stack spacing={1.5}>
              {starterHouse.materials.map((item) => (
                <Box key={item.block}>
                  <Typography fontWeight={700}>{item.block.replace('minecraft:', '')}</Typography>
                  <Typography variant="body2" color="text.secondary">{item.count} blocos · {Math.ceil(item.count / 64)} stack(s)</Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Box>

        <Paper sx={{ p: 2 }}>
          <Stack direction="row" justifyContent="space-between">
            <Typography fontWeight={700}>Camada {layer}</Typography>
            <Typography color="text.secondary">0–{maxLayer}</Typography>
          </Stack>
          <Slider value={layer} min={0} max={maxLayer} step={1} marks onChange={(_, value) => setLayer(value as number)} />
        </Paper>
      </Stack>
    </Container>
  )
}
