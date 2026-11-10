import { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  FormControlLabel,
  LinearProgress,
  Paper,
  Slider,
  Stack,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import { BlueprintViewer, type CameraPreset } from './components/BlueprintViewer'
import { starterHouse } from './data/starter-house'
import type { BlueprintBlock } from './domain/blueprint'
import {
  blockDisplayName,
  summarizeLayer,
  summarizeMaterials,
} from './utils/materials'

const storageKey = 'minecraft-building-academy:starter-house-01:layers'

function loadCompletedLayers() {
  try {
    const value = localStorage.getItem(storageKey)
    if (!value) return [] as number[]
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed.filter((item) => Number.isInteger(item)) : []
  } catch {
    return [] as number[]
  }
}

export default function App() {
  const [layer, setLayer] = useState(0)
  const [showPrevious, setShowPrevious] = useState(true)
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('iso')
  const [completedLayers, setCompletedLayers] = useState<number[]>(loadCompletedLayers)
  const [selectedBlock, setSelectedBlock] = useState<BlueprintBlock | null>(null)

  const maxLayer = useMemo(
    () => Math.max(...starterHouse.blocks.map((block) => block.y)),
    [],
  )

  const currentLayerBlocks = useMemo(
    () => starterHouse.blocks.filter((block) => block.y === layer),
    [layer],
  )

  const currentMaterials = useMemo(
    () => summarizeLayer(starterHouse.blocks, layer),
    [layer],
  )

  const totalMaterials = useMemo(
    () => summarizeMaterials(starterHouse.blocks),
    [],
  )

  const progress = (completedLayers.length / (maxLayer + 1)) * 100
  const layerComplete = completedLayers.includes(layer)

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(completedLayers))
  }, [completedLayers])

  useEffect(() => {
    setSelectedBlock(null)
  }, [layer])

  function toggleLayerComplete() {
    if (layerComplete) {
      setCompletedLayers((current) => current.filter((item) => item !== layer))
      return
    }

    setCompletedLayers((current) => [...new Set([...current, layer])].sort((a, b) => a - b))

    if (layer < maxLayer) {
      setLayer(layer + 1)
    }
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="overline" color="text.secondary">
            Minecraft Building Academy · Bedrock
          </Typography>
          <Typography variant="h3" fontWeight={800}>
            {starterHouse.title}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', gap: 1 }}>
            <Chip label={starterHouse.style} />
            <Chip label="Survival · início de jogo" />
            <Chip
              label={
                starterHouse.size.width +
                '×' +
                starterHouse.size.depth +
                '×' +
                starterHouse.size.height
              }
            />
            <Chip label={starterHouse.blocks.length + ' posições de blocos'} />
          </Stack>
        </Box>

        <Paper sx={{ p: 2 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
            <Box sx={{ flex: 1 }}>
              <Stack direction="row" justifyContent="space-between" spacing={2}>
                <Typography fontWeight={700}>Progresso da construção</Typography>
                <Typography color="text.secondary">
                  {completedLayers.length}/{maxLayer + 1} camadas
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ mt: 1, height: 8, borderRadius: 999 }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              O progresso fica salvo neste navegador.
            </Typography>
          </Stack>
        </Paper>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '300px minmax(0, 1fr) 320px' },
            gap: 2,
          }}
        >
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">O que aprender aqui</Typography>
            <Divider sx={{ my: 1.5 }} />
            <Stack spacing={2}>
              {starterHouse.lessons.map((lesson) => (
                <Box key={lesson.id}>
                  <Typography fontWeight={700}>{lesson.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {lesson.explanation}
                  </Typography>
                </Box>
              ))}
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography variant="overline" color="text.secondary">
              Camada {layer + 1}
            </Typography>
            <Typography fontWeight={700}>
              {currentLayerBlocks.length} posições nesta camada
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {starterHouse.layerNotes?.[layer] ?? 'Siga o blueprint destacando apenas a camada atual.'}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="overline" color="text.secondary">
              Bloco selecionado
            </Typography>
            {selectedBlock ? (
              <Stack spacing={1} sx={{ mt: 0.5 }}>
                <Typography fontWeight={800}>
                  {blockDisplayName(selectedBlock.block)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  X {selectedBlock.x} · Y {selectedBlock.y} · Z {selectedBlock.z}
                </Typography>
                {selectedBlock.states && (
                  <Stack direction="row" gap={0.75} flexWrap="wrap">
                    {Object.entries(selectedBlock.states)
                      .filter(([, value]) => value !== undefined)
                      .map(([key, value]) => (
                        <Chip
                          key={key}
                          size="small"
                          variant="outlined"
                          label={key + ': ' + String(value)}
                        />
                      ))}
                  </Stack>
                )}
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Clique em um bloco da camada atual para ver coordenada e orientação.
              </Typography>
            )}
          </Paper>

          <Paper sx={{ overflow: 'hidden' }}>
            <Box
              sx={{
                px: 2,
                py: 1.5,
                display: 'flex',
                gap: 1.5,
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
              }}
            >
              <ToggleButtonGroup
                exclusive
                size="small"
                value={cameraPreset}
                onChange={(_, value: CameraPreset | null) => {
                  if (value) setCameraPreset(value)
                }}
              >
                <ToggleButton value="iso">3D</ToggleButton>
                <ToggleButton value="top">Topo</ToggleButton>
                <ToggleButton value="front">Frente</ToggleButton>
                <ToggleButton value="side">Lado</ToggleButton>
              </ToggleButtonGroup>

              <FormControlLabel
                control={
                  <Switch
                    checked={showPrevious}
                    onChange={(event) => setShowPrevious(event.target.checked)}
                  />
                }
                label="Ver anteriores"
              />
            </Box>
            <Divider />
            <Box sx={{ height: { xs: 480, md: 620 } }}>
              <BlueprintViewer
                blueprint={starterHouse}
                layer={layer}
                showPrevious={showPrevious}
                cameraPreset={cameraPreset}
                selectedBlock={selectedBlock}
                onSelectBlock={setSelectedBlock}
              />
            </Box>
          </Paper>

          <Stack spacing={2}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Materiais desta camada</Typography>
              <Divider sx={{ my: 1.5 }} />
              <Stack spacing={1.2}>
                {currentMaterials.map((item) => (
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    spacing={2}
                    key={item.block}
                  >
                    <Typography variant="body2">
                      {blockDisplayName(item.block)}
                    </Typography>
                    <Typography variant="body2" fontWeight={700}>
                      {item.count}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Paper>

            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Lista total</Typography>
              <Divider sx={{ my: 1.5 }} />
              <Stack spacing={1.2}>
                {totalMaterials.map((item) => (
                  <Box key={item.block}>
                    <Stack direction="row" justifyContent="space-between" spacing={2}>
                      <Typography variant="body2">
                        {blockDisplayName(item.block)}
                      </Typography>
                      <Typography variant="body2" fontWeight={700}>
                        {item.count}
                      </Typography>
                    </Stack>
                    {item.count > 64 && (
                      <Typography variant="caption" color="text.secondary">
                        {Math.floor(item.count / 64)} stack(s) + {item.count % 64}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Stack>
        </Box>

        <Paper sx={{ p: 2 }}>
          <Stack spacing={2}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ sm: 'center' }}
              spacing={2}
            >
              <Box>
                <Typography fontWeight={800}>
                  Camada {layer + 1} de {maxLayer + 1}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Y = {layer} · use o slider ou marque a camada como concluída para avançar.
                </Typography>
              </Box>
              <Button
                variant={layerComplete ? 'outlined' : 'contained'}
                onClick={toggleLayerComplete}
              >
                {layerComplete
                  ? 'Reabrir esta camada'
                  : layer < maxLayer
                    ? 'Concluir e avançar'
                    : 'Concluir construção'}
              </Button>
            </Stack>

            <Slider
              value={layer}
              min={0}
              max={maxLayer}
              step={1}
              marks
              onChange={(_, value) => setLayer(value as number)}
            />
          </Stack>
        </Paper>
      </Stack>
    </Container>
  )
}
