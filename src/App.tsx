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
import { blueprintRegistry } from './data/blueprints'
import { buildingCourse } from './data/course'
import type { BlueprintBlock } from './domain/blueprint'
import {
  BASE_BUILD_STEP_ID,
  composeBlueprint,
} from './utils/compose-blueprint'
import {
  blockDisplayName,
  summarizeMaterials,
} from './utils/materials'
import { applyPalette } from './utils/palette'

type LearningMode = 'build' | 'learn'

const initialBlueprintId =
  buildingCourse.chapters.find((chapter) => chapter.blueprintId)?.blueprintId ??
  Object.keys(blueprintRegistry)[0]

function progressStorageKey(blueprintId: string) {
  return 'minecraft-building-academy:' + blueprintId + ':steps'
}

function loadProgressByBlueprint() {
  const progress: Record<string, string[]> = {}

  for (const blueprintId of Object.keys(blueprintRegistry)) {
    try {
      const value = localStorage.getItem(progressStorageKey(blueprintId))
      if (!value) {
        progress[blueprintId] = []
        continue
      }

      const parsed = JSON.parse(value)
      progress[blueprintId] = Array.isArray(parsed)
        ? parsed.filter((item): item is string => typeof item === 'string')
        : []
    } catch {
      progress[blueprintId] = []
    }
  }

  return progress
}

export default function App() {
  const [mode, setMode] = useState<LearningMode>('learn')
  const [activeBlueprintId, setActiveBlueprintId] = useState(initialBlueprintId)
  const [selectedPaletteId, setSelectedPaletteId] = useState('spruce')
  const [stepIndex, setStepIndex] = useState(0)
  const [showPrevious, setShowPrevious] = useState(true)
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('iso')
  const [completedByBlueprint, setCompletedByBlueprint] =
    useState<Record<string, string[]>>(loadProgressByBlueprint)
  const [selectedBlock, setSelectedBlock] = useState<BlueprintBlock | null>(null)
  const [solutionRevealed, setSolutionRevealed] = useState(false)
  const [hintRevealed, setHintRevealed] = useState(false)

  const activeBlueprint = blueprintRegistry[activeBlueprintId]
  const completedStepIds = completedByBlueprint[activeBlueprintId] ?? []

  const completedBlueprintIds = useMemo(() => {
    const completed = new Set<string>()

    for (const blueprint of Object.values(blueprintRegistry)) {
      const progress = completedByBlueprint[blueprint.id] ?? []
      const validCompleted = blueprint.steps.filter((step) =>
        progress.includes(step.id),
      )

      if (validCompleted.length === blueprint.steps.length) {
        completed.add(blueprint.id)
      }
    }

    return completed
  }, [completedByBlueprint])

  const unlockedBlueprintIds = useMemo(() => {
    const unlocked = new Set<string>()
    let previousBlueprintComplete = true

    for (const chapter of buildingCourse.chapters) {
      if (!chapter.blueprintId) {
        previousBlueprintComplete = false
        continue
      }

      if (previousBlueprintComplete) {
        unlocked.add(chapter.blueprintId)
      }

      previousBlueprintComplete = completedBlueprintIds.has(chapter.blueprintId)
    }

    return unlocked
  }, [completedBlueprintIds])

  const selectedPalette = useMemo(
    () =>
      activeBlueprint.palettes?.find(
        (palette) => palette.id === selectedPaletteId,
      ) ?? activeBlueprint.palettes?.[0],
    [activeBlueprint, selectedPaletteId],
  )

  const effectiveBlueprint = useMemo(
    () => applyPalette(activeBlueprint, selectedPalette),
    [activeBlueprint, selectedPalette],
  )

  const baseBlueprint = activeBlueprint.baseBlueprintId
    ? blueprintRegistry[activeBlueprint.baseBlueprintId]
    : undefined

  const effectiveBaseBlueprint = useMemo(() => {
    if (!baseBlueprint) return undefined

    const basePalette =
      baseBlueprint.palettes?.find(
        (palette) => palette.id === selectedPaletteId,
      ) ?? baseBlueprint.palettes?.[0]

    return applyPalette(baseBlueprint, basePalette)
  }, [baseBlueprint, selectedPaletteId])

  const currentStepIndex = Math.min(
    stepIndex,
    Math.max(activeBlueprint.steps.length - 1, 0),
  )
  const currentStep = activeBlueprint.steps[currentStepIndex]

  const currentStepBlocks = useMemo(
    () =>
      effectiveBlueprint.blocks.filter(
        (block) => block.stepId === currentStep.id,
      ),
    [currentStep.id, effectiveBlueprint],
  )

  const currentMaterials = useMemo(
    () => summarizeMaterials(currentStepBlocks),
    [currentStepBlocks],
  )

  const totalMaterials = useMemo(
    () => summarizeMaterials(effectiveBlueprint.blocks),
    [effectiveBlueprint],
  )

  const firstIncompleteIndex = useMemo(() => {
    const index = activeBlueprint.steps.findIndex(
      (step) => !completedStepIds.includes(step.id),
    )

    return index === -1 ? activeBlueprint.steps.length - 1 : index
  }, [activeBlueprint.steps, completedStepIds])

  const stepComplete = completedStepIds.includes(currentStep.id)
  const chapterComplete = completedBlueprintIds.has(activeBlueprint.id)

  const challengeLocked =
    mode === 'learn' &&
    Boolean(currentStep.challenge) &&
    !solutionRevealed &&
    !stepComplete

  const currentStepVisible = mode === 'build' || !challengeLocked

  const visibleStepIds = useMemo(() => {
    const baseContext =
      showPrevious && effectiveBaseBlueprint ? [BASE_BUILD_STEP_ID] : []

    if (!showPrevious) {
      return currentStepVisible ? [currentStep.id] : []
    }

    const previous = activeBlueprint.steps
      .slice(0, currentStepIndex)
      .map((step) => step.id)

    return currentStepVisible
      ? [...baseContext, ...previous, currentStep.id]
      : [...baseContext, ...previous]
  }, [
    activeBlueprint.steps,
    currentStep.id,
    currentStepIndex,
    currentStepVisible,
    effectiveBaseBlueprint,
    showPrevious,
  ])

  const displayBlueprint = useMemo(
    () =>
      effectiveBaseBlueprint
        ? composeBlueprint(
            effectiveBaseBlueprint,
            effectiveBlueprint,
            visibleStepIds,
          )
        : effectiveBlueprint,
    [effectiveBaseBlueprint, effectiveBlueprint, visibleStepIds],
  )

  const progress =
    (completedStepIds.filter((id) =>
      activeBlueprint.steps.some((step) => step.id === id),
    ).length /
      activeBlueprint.steps.length) *
    100

  const activeChapterIndex = buildingCourse.chapters.findIndex(
    (chapter) => chapter.blueprintId === activeBlueprint.id,
  )

  const nextUnlockedBlueprintId = useMemo(() => {
    if (!chapterComplete) return undefined

    return buildingCourse.chapters
      .slice(activeChapterIndex + 1)
      .map((chapter) => chapter.blueprintId)
      .find(
        (blueprintId): blueprintId is string =>
          Boolean(
            blueprintId &&
              unlockedBlueprintIds.has(blueprintId) &&
              blueprintRegistry[blueprintId],
          ),
      )
  }, [
    activeChapterIndex,
    chapterComplete,
    unlockedBlueprintIds,
  ])

  useEffect(() => {
    for (const [blueprintId, completed] of Object.entries(
      completedByBlueprint,
    )) {
      localStorage.setItem(
        progressStorageKey(blueprintId),
        JSON.stringify(completed),
      )
    }
  }, [completedByBlueprint])

  useEffect(() => {
    const palettes = activeBlueprint.palettes ?? []

    if (
      palettes.length > 0 &&
      !palettes.some((palette) => palette.id === selectedPaletteId)
    ) {
      setSelectedPaletteId(palettes[0].id)
    }
  }, [activeBlueprint, selectedPaletteId])

  useEffect(() => {
    setSelectedBlock(null)
    setSolutionRevealed(false)
    setHintRevealed(false)
  }, [activeBlueprintId, currentStepIndex, mode])

  function selectBlueprint(blueprintId: string) {
    if (!unlockedBlueprintIds.has(blueprintId)) return

    setActiveBlueprintId(blueprintId)
    setStepIndex(0)
  }

  function visitStep(index: number) {
    if (index > firstIncompleteIndex) return
    setStepIndex(index)
  }

  function completeCurrentStep() {
    if (challengeLocked || stepComplete) return

    setCompletedByBlueprint((current) => ({
      ...current,
      [activeBlueprint.id]: [
        ...new Set([
          ...(current[activeBlueprint.id] ?? []),
          currentStep.id,
        ]),
      ],
    }))

    if (currentStepIndex < activeBlueprint.steps.length - 1) {
      setStepIndex(currentStepIndex + 1)
    }
  }

  function goToNextUnlockedStep() {
    if (currentStepIndex < firstIncompleteIndex) {
      setStepIndex(currentStepIndex + 1)
    }
  }

  function resetCurrentChapter() {
    setCompletedByBlueprint((current) => ({
      ...current,
      [activeBlueprint.id]: [],
    }))
    setStepIndex(0)
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
              {activeBlueprint.title}
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              sx={{ mt: 1, flexWrap: 'wrap', gap: 1 }}
            >
              <Chip label={activeBlueprint.style} />
              <Chip label={'Bedrock ' + activeBlueprint.targetVersion} />
              <Chip label={'Survival · ' + activeBlueprint.survivalTier} />
              <Chip label={activeBlueprint.steps.length + ' etapas'} />
              {baseBlueprint && (
                <Chip
                  variant="outlined"
                  label={'Continua de: ' + baseBlueprint.title}
                />
              )}
            </Stack>
          </Box>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems={{ sm: 'flex-end' }}
          >
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

            {activeBlueprint.palettes &&
              activeBlueprint.palettes.length > 0 && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Paleta
                  </Typography>
                  <ToggleButtonGroup
                    exclusive
                    size="small"
                    value={selectedPaletteId}
                    onChange={(_, value: string | null) => {
                      if (value) setSelectedPaletteId(value)
                    }}
                    sx={{ display: 'flex', mt: 0.5 }}
                  >
                    {activeBlueprint.palettes.map((palette) => (
                      <ToggleButton key={palette.id} value={palette.id}>
                        {palette.title}
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                </Box>
              )}
          </Stack>
        </Stack>

        <CourseRoadmap
          course={buildingCourse}
          activeBlueprintId={activeBlueprint.id}
          unlockedBlueprintIds={unlockedBlueprintIds}
          completedBlueprintIds={completedBlueprintIds}
          onSelectBlueprint={selectBlueprint}
        />

        <Paper sx={{ p: 2 }}>
          <Stack spacing={1.5}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              alignItems={{ md: 'center' }}
            >
              <Box sx={{ flex: 1 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  spacing={2}
                >
                  <Typography fontWeight={700}>
                    Progresso · {activeBlueprint.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {completedStepIds.length}/{activeBlueprint.steps.length} etapas
                  </Typography>
                </Stack>

                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{ mt: 1, height: 8, borderRadius: 999 }}
                />
              </Box>

              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                flexWrap="wrap"
              >
                <Typography variant="body2" color="text.secondary">
                  {mode === 'learn'
                    ? 'Learn esconde algumas soluções até você tentar.'
                    : 'Build mostra o blueprint imediatamente.'}
                </Typography>

                {completedStepIds.length > 0 && (
                  <Button
                    size="small"
                    variant="text"
                    onClick={resetCurrentChapter}
                  >
                    Reiniciar capítulo
                  </Button>
                )}
              </Stack>
            </Stack>

            <Box
              sx={{
                display: 'flex',
                gap: 0.75,
                overflowX: 'auto',
                pb: 0.5,
              }}
            >
              {activeBlueprint.steps.map((step, index) => {
                const completed = completedStepIds.includes(step.id)
                const current = index === currentStepIndex
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
            gridTemplateColumns: {
              xs: '1fr',
              lg: '320px minmax(0, 1fr) 320px',
            },
            gap: 2,
          }}
        >
          <Stack spacing={2}>
            <Paper sx={{ p: 2 }}>
              <Stack spacing={1.5}>
                <Box>
                  <Typography variant="overline" color="text.secondary">
                    Etapa {currentStepIndex + 1} de {activeBlueprint.steps.length}
                  </Typography>
                  <Typography variant="h6" fontWeight={800}>
                    {currentStep.title}
                  </Typography>

                  <Stack
                    direction="row"
                    gap={0.75}
                    flexWrap="wrap"
                    sx={{ mt: 1 }}
                  >
                    <Chip size="small" label={'Y = ' + currentStep.layer} />
                    <Chip
                      size="small"
                      variant="outlined"
                      label={currentStep.kind}
                    />
                    {currentStep.concept && (
                      <Chip
                        size="small"
                        variant="outlined"
                        label={currentStep.concept}
                      />
                    )}
                  </Stack>
                </Box>

                {challengeLocked && currentStep.challenge ? (
                  <>
                    <Divider />
                    <Box>
                      <Typography
                        variant="overline"
                        color="text.secondary"
                      >
                        Desafio
                      </Typography>
                      <Typography fontWeight={700} sx={{ mt: 0.5 }}>
                        {currentStep.challenge.prompt}
                      </Typography>
                    </Box>

                    {hintRevealed && currentStep.challenge.hint && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Dica: {currentStep.challenge.hint}
                      </Typography>
                    )}

                    <Stack direction="row" gap={1} flexWrap="wrap">
                      {currentStep.challenge.hint && !hintRevealed && (
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => setHintRevealed(true)}
                        >
                          Ver dica
                        </Button>
                      )}
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => setSolutionRevealed(true)}
                      >
                        Revelar solução
                      </Button>
                    </Stack>
                  </>
                ) : (
                  <>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {currentStep.description}
                    </Typography>

                    {currentStep.tip && (
                      <Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          Por que funciona
                        </Typography>
                        <Typography variant="body2">
                          {currentStep.tip}
                        </Typography>
                      </Box>
                    )}

                    {mode === 'learn' &&
                      currentStep.challenge?.reflection &&
                      (solutionRevealed || stepComplete) && (
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
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
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    X {selectedBlock.x} · Y {selectedBlock.y} · Z{' '}
                    {selectedBlock.z}
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
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
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
                    onChange={(event) =>
                      setShowPrevious(event.target.checked)
                    }
                  />
                }
                label={baseBlueprint ? 'Ver base + anteriores' : 'Ver anteriores'}
              />
            </Box>

            <Divider />

            <Box sx={{ height: { xs: 480, md: 650 } }}>
              <BlueprintViewer
                blueprint={displayBlueprint}
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
              <Typography variant="h6">
                Materiais desta etapa
              </Typography>
              <Divider sx={{ my: 1.5 }} />

              {challengeLocked ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  A lista aparece junto com a solução para não entregar a
                  resposta antes da tentativa.
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
              <Typography variant="h6">
                {baseBlueprint ? 'Materiais novos do capítulo' : 'Lista total'}
              </Typography>
              <Divider sx={{ my: 1.5 }} />

              {baseBlueprint && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mb: 1.5 }}
                >
                  A casa já existente não entra nesta conta.
                </Typography>
              )}

              <Stack spacing={1.2}>
                {totalMaterials.map((item) => (
                  <Box key={item.block}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      spacing={2}
                    >
                      <Typography variant="body2">
                        {blockDisplayName(item.block)}
                      </Typography>
                      <Typography variant="body2" fontWeight={700}>
                        {item.count}
                      </Typography>
                    </Stack>

                    {item.count > 64 && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {Math.floor(item.count / 64)} stack(s) +{' '}
                        {item.count % 64}
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
              <Typography fontWeight={800}>
                {currentStep.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {currentStepBlocks.length} posições · camada Y=
                {currentStep.layer}
              </Typography>
            </Box>

            <Stack direction="row" gap={1} flexWrap="wrap">
              <Button
                variant="outlined"
                disabled={currentStepIndex === 0}
                onClick={() => setStepIndex(currentStepIndex - 1)}
              >
                Anterior
              </Button>

              {stepComplete ? (
                currentStepIndex < firstIncompleteIndex ? (
                  <Button
                    variant="contained"
                    onClick={goToNextUnlockedStep}
                  >
                    Próxima etapa
                  </Button>
                ) : nextUnlockedBlueprintId ? (
                  <Button
                    variant="contained"
                    onClick={() =>
                      selectBlueprint(nextUnlockedBlueprintId)
                    }
                  >
                    Abrir próximo capítulo
                  </Button>
                ) : (
                  <Button variant="contained" disabled>
                    Capítulo concluído
                  </Button>
                )
              ) : (
                <Button
                  variant="contained"
                  disabled={!canComplete}
                  onClick={completeCurrentStep}
                >
                  {currentStepIndex === activeBlueprint.steps.length - 1
                    ? 'Concluir capítulo'
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
