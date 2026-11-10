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
  Stack,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import { BlueprintViewer, type CameraPreset } from './components/BlueprintViewer'
import { CourseRoadmap } from './components/CourseRoadmap'
import { buildingCourse } from './data/course'
import { starterHouse } from './data/starter-house'
import type { BlueprintBlock } from './domain/blueprint'
import {
  blockDisplayName,
  summarizeMaterials,
} from './utils/materials'

type LearningMode = 'build' | 'learn'

const storageKey = 'minecraft-building-academy:starter-house-01:steps'

function loadCompletedSteps() {
  try {
    const value = localStorage.getItem(storageKey)
    if (!value) return [] as string[]
    const parsed = JSON.parse(value)
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === 'string')
      : []
  } catch {
    return [] as string[]
  }
}

export default function App() {
  const [mode, setMode] = useState<LearningMode>('learn')
  const [stepIndex, setStepIndex] = useState(0)
  const [showPrevious, setShowPrevious] = useState(true)
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('iso')
  const [completedStepIds, setCompletedStepIds] = useState<string[]>(loadCompletedSteps)
  const [selectedBlock, setSelectedBlock] = useState<BlueprintBlock | null>(null)
  const [solutionRevealed, setSolutionRevealed] = useState(false)
  const [hintRevealed, setHintRevealed] = useState(false)

  const currentStep = starterHouse.steps[stepIndex]

  const currentStepBlocks = useMemo(
    () => starterHouse.blocks.filter((block) => block.stepId === currentStep.id),
    [currentStep.id],
  )

  const currentMaterials = useMemo(
    () => summarizeMaterials(currentStepBlocks),
    [currentStepBlocks],
  )

  const totalMaterials = useMemo(
    () => summarizeMaterials(starterHouse.blocks),
    [],
  )

  const firstIncompleteIndex = useMemo(() => {
    const index = starterHouse.steps.findIndex(
      (step) => !completedStepIds.includes(step.id),
    )
    return index === -1 ? starterHouse.steps.length - 1 : index
  }, [completedStepIds])

  const stepComplete = completedStepIds.includes(currentStep.id)
  const challengeLocked =
    mode === 'learn' &&
    Boolean(currentStep.challenge) &&
    !solutionRevealed &&
    !stepComplete

  const currentStepVisible = mode === 'build' || !challengeLocked

  const visibleStepIds = useMemo(() => {
    if (!showPrevious) {
      return currentStepVisible ? [currentStep.id] : []
    }

    const previous = starterHouse.steps
      .slice(0, stepIndex)
      .map((step) => step.id)

    return currentStepVisible ? [...previous, currentStep.id] : previous
  }, [currentStep.id, currentStepVisible, showPrevious, stepIndex])

  const progress = (completedStepIds.length / starterHouse.steps.length) * 100

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(completedStepIds))
  }, [completedStepIds])

  useEffect(() => {
    setSelectedBlock(null)
    setSolutionRevealed(false)
    setHintRevealed(false)
  }, [stepIndex, mode])

  function visitStep(index: number) {
    if (index > firstIncompleteIndex) return
    setStepIndex(index)
  }

  function completeCurrentStep() {
    if (challengeLocked || stepComplete) return

    setCompletedStepIds((current) => [...new Set([...current, currentStep.id])])

    if (stepIndex < starterHouse.steps.length - 1) {
      setStepIndex(stepIndex + 1)
    }
  }

  function goToNextUnlockedStep() {
    if (stepIndex < firstIncompleteIndex) {
      setStepIndex(stepIndex + 1)
    }
  }

  const canComplete = !stepComplete && !challengeLocked

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
      <Stack spacing={3}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ md: 'flex-end' }}
          spacing={2}
        >
          <Box>
            <Typography variant="overline" color="text.secondary">
              Minecraft Building Academy · Bedrock
            </Typography>
            <Typography variant="h3" fontWeight={800}>
              {starterHouse.title}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap', gap: 1 }}>
              <Chip label={starterHouse.style} />
              <Chip label={'Bedrock ' + starterHouse.targetVersion} />
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
              <Chip label={starterHouse.steps.length + ' etapas'} />
            </Stack>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary">
              Modo de estudo
            </Typography>
            <ToggleButtonGroup
              exclusive
              size="small"
              value={mode}
              onChange={(_, value: LearningMode | null) => {
                if (value) setMode(value)
              }}
              sx={{ display: 'flex', mt: 0.5 }}
            >
              <ToggleButton value="learn">Learn</ToggleButton>
              <ToggleButton value="build">Build</ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Stack>

        <CourseRoadmap course={buildingCourse} />

        <Paper sx={{ p: 2 }}>
          <Stack spacing={1.5}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              alignItems={{ md: 'center' }}
            >
              <Box sx={{ flex: 1 }}>
                <Stack direction="row" justifyContent="space-between" spacing={2}>
                  <Typography fontWeight={700}>Progresso da Casa Inicial</Typography>
                  <Typography color="text.secondary">
                    {completedStepIds.length}/{starterHouse.steps.length} etapas
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{ mt: 1, height: 8, borderRadius: 999 }}
                />
              </Box>

              <Typography variant="body2" color="text.secondary">
                {mode === 'learn'
                  ? 'Learn esconde algumas soluções até você tentar.'
                  : 'Build mostra o blueprint imediatamente.'}
              </Typography>
            </Stack>

            <Box
              sx={{
                display: 'flex',
                gap: 0.75,
                overflowX: 'auto',
                pb: 0.5,
              }}
            >
              {starterHouse.steps.map((step, index) => {
                const completed = completedStepIds.includes(step.id)
                const current = index === stepIndex
                const unlocked = index <= firstIncompleteIndex

                return (
                  <Chip
                    key={step.id}
                    clickable={unlocked}
                    disabled={!unlocked}
                    onClick={() => visitStep(index)}
                    variant={completed || current ? 'filled' : 'outlined'}
                    label={(completed ? '✓ ' : '') + String(index + 1)}
                  />
                )
              })}
            </Box>
          </Stack>
        </Paper>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '320px minmax(0, 1fr) 320px' },
            gap: 2,
          }}
        >
          <Stack spacing={2}>
            <Paper sx={{ p: 2 }}>
              <Stack spacing={1.5}>
                <Box>
                  <Typography variant="overline" color="text.secondary">
                    Etapa {stepIndex + 1} de {starterHouse.steps.length}
                  </Typography>
                  <Typography variant="h6" fontWeight={800}>
                    {currentStep.title}
                  </Typography>
                  <Stack direction="row" gap={0.75} flexWrap="wrap" sx={{ mt: 1 }}>
                    <Chip size="small" label={'Y = ' + currentStep.layer} />
                    <Chip size="small" variant="outlined" label={currentStep.kind} />
                    {currentStep.concept && (
                      <Chip size="small" variant="outlined" label={currentStep.concept} />
                    )}
                  </Stack>
                </Box>

                {challengeLocked && currentStep.challenge ? (
                  <>
                    <Divider />
                    <Box>
                      <Typography variant="overline" color="text.secondary">
                        Desafio
                      </Typography>
                      <Typography fontWeight={700} sx={{ mt: 0.5 }}>
                        {currentStep.challenge.prompt}
                      </Typography>
                    </Box>

                    {hintRevealed && currentStep.challenge.hint && (
                      <Typography variant="body2" color="text.secondary">
                        Dica: {currentStep.challenge.hint}
                      </Typography>
                    )}

                    <Stack direction="row" gap={1} flexWrap="wrap">
                      {currentStep.challenge.hint && !hintRevealed && (
                        <Button variant="outlined" size="small" onClick={() => setHintRevealed(true)}>
                          Ver dica
                        </Button>
                      )}
                      <Button variant="contained" size="small" onClick={() => setSolutionRevealed(true)}>
                        Revelar solução
                      </Button>
                    </Stack>
                  </>
                ) : (
                  <>
                    <Typography variant="body2" color="text.secondary">
                      {currentStep.description}
                    </Typography>

                    {currentStep.tip && (
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Por que funciona
                        </Typography>
                        <Typography variant="body2">{currentStep.tip}</Typography>
                      </Box>
                    )}

                    {mode === 'learn' &&
                      currentStep.challenge?.reflection &&
                      (solutionRevealed || stepComplete) && (
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Observe
                          </Typography>
                          <Typography variant="body2">
                            {currentStep.challenge.reflection}
                          </Typography>
                        </Box>
                      )}
                  </>
                )}
              </Stack>
            </Paper>

            <Paper sx={{ p: 2 }}>
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
                  {currentStepVisible
                    ? 'Clique em um bloco novo para ver coordenada e orientação.'
                    : 'Revele a solução para inspecionar os blocos desta etapa.'}
                </Typography>
              )}
            </Paper>
          </Stack>

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
            <Box sx={{ height: { xs: 480, md: 650 } }}>
              <BlueprintViewer
                blueprint={starterHouse}
                visibleStepIds={visibleStepIds}
                currentStepId={currentStep.id}
                cameraPreset={cameraPreset}
                selectedBlock={selectedBlock}
                onSelectBlock={setSelectedBlock}
              />
            </Box>
          </Paper>

          <Stack spacing={2}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Materiais desta etapa</Typography>
              <Divider sx={{ my: 1.5 }} />

              {challengeLocked ? (
                <Typography variant="body2" color="text.secondary">
                  A lista aparece junto com a solução para não entregar a resposta antes da tentativa.
                </Typography>
              ) : (
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
              )}
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
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            alignItems={{ md: 'center' }}
            spacing={2}
          >
            <Box>
              <Typography fontWeight={800}>{currentStep.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {currentStepBlocks.length} posições · camada Y={currentStep.layer}
              </Typography>
            </Box>

            <Stack direction="row" gap={1} flexWrap="wrap">
              <Button
                variant="outlined"
                disabled={stepIndex === 0}
                onClick={() => setStepIndex(stepIndex - 1)}
              >
                Anterior
              </Button>

              {stepComplete ? (
                <Button
                  variant="contained"
                  disabled={stepIndex >= firstIncompleteIndex}
                  onClick={goToNextUnlockedStep}
                >
                  Próxima etapa
                </Button>
              ) : (
                <Button
                  variant="contained"
                  disabled={!canComplete}
                  onClick={completeCurrentStep}
                >
                  {stepIndex === starterHouse.steps.length - 1
                    ? 'Concluir Casa Inicial'
                    : 'Concluir e avançar'}
                </Button>
              )}
            </Stack>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  )
}
