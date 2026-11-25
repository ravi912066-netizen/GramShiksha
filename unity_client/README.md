# Gram Sikha (ग्राम शिक्षा) – Unity VR, AR & 3D Educational Project

> **Interactive Rural Education & Village Learning Experience in Virtual Reality (VR), Augmented Reality (AR), and 3D Interactive Web/Desktop.**

---

## 🏛 1. Project Architecture

Gram Sikha is structured using modular, decoupled systems adhering to Unity component-based design and event-driven communication:

```
GramShiksha / unity_client /
├── Assets/
│   ├── Prefabs/                     # 3D Village models (Houses, School, Hand Pump, Tractor, Trees)
│   ├── Resources/
│   │   └── EducationalData/         # Multilingual ScriptableObjects (EN & HI)
│   ├── Scenes/
│   │   ├── MainMenu.unity           # Mode selection, settings, localization
│   │   ├── Model_3D_Inspector.unity # 360° turntable, orbit camera, sub-part highlighting
│   │   ├── Village_VR_Tour.unity    # Immersive VR XR Origin, locomotion, guide NPC
│   │   └── AR_Model_Laboratory.unity# AR Foundation plane tracking, touch manipulation
│   └── Scripts/
│       ├── Core/                    # GameManager, SoundManager, GameEnums
│       ├── Data/                    # EducationalModelData (ScriptableObject)
│       ├── Viewer3D/                # ModelInspectorController, ModelPartHighlighter, ProceduralVillageAssets
│       ├── VR/                      # VRExplorationRig, VREducationalInteractable, VRVillageGuideNPC
│       ├── AR/                      # ARPlacementManager, ARObjectManipulator, ARPlaneVisualizerToggle
│       ├── UI/                      # EducationalPopupUI, MainMenuUI, ModelCatalogUI, HUDManager
│       └── Editor/                  # GramSikhaEditorTools (1-click asset & prefab generator)
├── Packages/
│   └── manifest.json                # URP, XR Interaction Toolkit, AR Foundation, OpenXR, TMP
└── ProjectSettings/                 # Project configuration
```

---

## 📦 2. Required Packages & Installation

Open Unity (recommended **2022.3 LTS** or **6000.x**), navigate to **Window > Package Manager**, and ensure the following dependencies are installed (already defined in `Packages/manifest.json`):

| Package Name | Version | Purpose |
| :--- | :--- | :--- |
| **XR Interaction Toolkit** (`com.unity.xr.interaction.toolkit`) | `2.5.4` / `3.0.x` | VR locomotion, Ray/Direct interactors, HMD tracking |
| **AR Foundation** (`com.unity.xr.arfoundation`) | `5.1.4` | Cross-platform AR plane detection & surface raycasting |
| **Google ARCore XR Plugin** (`com.unity.xr.arcore`) | `5.1.4` | Android AR runtime provider |
| **Apple ARKit XR Plugin** (`com.unity.xr.arkit`) | `5.1.4` | iOS AR runtime provider |
| **OpenXR Plugin** (`com.unity.xr.openxr`) | `1.10.0` | Multi-vendor VR runtime (Meta Quest, Pico, HTC Vive, Valve Index) |
| **XR Plugin Management** (`com.unity.xr.management`) | `4.4.0` | XR loader lifecycle manager |
| **TextMeshPro** (`com.unity.textmeshpro`) | `3.0.9` | High-fidelity UI typography & Hindi Unicode rendering |
| **Universal Render Pipeline (URP)** (`com.unity.render-pipelines.universal`) | `14.0.11` | Performant mobile AR and standalone VR rendering |

---

## 🎮 3. Unity Scene Hierarchy & Component Wire-up

### Scene 1: `MainMenu.unity`
```text
MainMenu (Scene)
├── Global_Managers [Persistent]
│   ├── GameManager (Script: GameManager.cs)
│   └── SoundManager (Script: SoundManager.cs + 3 AudioSources)
├── Directional Light (Sunlight)
├── Main Camera (Clear Flags: Solid Color / Skybox)
└── UI_Canvas [Screen Space - Overlay]
    ├── Background_Image (Rural Village Panorama)
    ├── Header_Title ("ग्राम शिक्षा / Gram Sikha")
    ├── Mode_Selection_Panel
    │   ├── Btn_VRTour (Button -> MainMenuUI.OnModeButtonClicked(VirtualReality))
    │   ├── Btn_ARLab (Button -> MainMenuUI.OnModeButtonClicked(AugmentedReality))
    │   ├── Btn_3DViewer (Button -> MainMenuUI.OnModeButtonClicked(ThreeDViewer))
    │   └── Btn_Exit (Button -> MainMenuUI.OnExitGame())
    ├── Settings_Bar
    │   ├── Btn_LanguageToggle (Button -> MainMenuUI.OnToggleLanguage())
    │   ├── Slider_Volume (Slider -> MainMenuUI.OnAmbienceSliderChanged())
    │   └── Btn_Mute (Button -> MainMenuUI.OnToggleAudioMute())
    └── Modal_AboutGramSikha (GameObject, inactive by default)
```

### Scene 2: `Model_3D_Inspector.unity`
```text
Model_3D_Inspector (Scene)
├── Directional Light & Environment Light
├── Viewer_Pivot (Transform at 0, 0, 0)
│   └── Model_Spawn_Anchor (Transform at 0, 0, 0)
├── Camera_Holder
│   └── Main Camera (Script: ModelInspectorController.cs)
│       - Pivot Point -> Viewer_Pivot
│       - Model Spawn Anchor -> Model_Spawn_Anchor
│       - Zoom Speed: 3.0, Min Distance: 1.0, Max Distance: 10.0
├── UI_Canvas [Screen Space - Overlay]
│   ├── Top_HUD (Script: HUDManager.cs)
│   │   ├── Btn_Back (Button -> ReturnToMainMenu)
│   │   ├── Txt_Title ("3D Model Inspector")
│   │   └── Btn_Language ("हिंदी / EN")
│   ├── Left_ModelCatalog_Scroll (Script: ModelCatalogUI.cs)
│   │   ├── Category_Filters (All, Housing, Agriculture, Water, Education)
│   │   └── Card_Container (GridLayoutGroup)
│   └── Educational_Popup_Modal (Script: EducationalPopupUI.cs)
│       ├── Header (Icon, Title TMP, Category Badge)
│       ├── Body (Description, Key Facts, History, Utility)
│       ├── Audio_Controls (Play/Pause Voiceover Button)
│       └── Btn_Close
└── EventSystem (Input System UI Input Module)
```

### Scene 3: `Village_VR_Tour.unity`
```text
Village_VR_Tour (Scene)
├── Environment
│   ├── Terrain / Village Ground (Layer: Ground, Tag: Ground)
│   ├── Roads & Footpaths
│   ├── Directional Light (Warm morning sun)
│   └── Skybox (Rural morning sky)
├── Village_Buildings_And_Assets
│   ├── Mud_House_Cluster
│   │   └── Village_Mud_House (Script: VREducationalInteractable.cs + BoxCollider)
│   ├── Village_Primary_School
│   │   └── School_Building (Script: VREducationalInteractable.cs + BoxCollider)
│   ├── Water_Sanitation_Zone
│   │   └── Village_Hand_Pump (Script: VREducationalInteractable.cs + BoxCollider)
│   ├── Agricultural_Zone
│   │   ├── Farm_Tractor (Script: VREducationalInteractable.cs + BoxCollider)
│   │   └── Crop_Fields (Wheat / Mustard patch)
│   └── Central_Chaupal
│       ├── Village_Banyan_Tree (Script: VREducationalInteractable.cs + BoxCollider)
│       └── NPC_VillageGuide (Script: VRVillageGuideNPC.cs + CapsuleCollider Trigger)
├── XR_Origin (VR Player Rig) (Script: VRExplorationRig.cs + CharacterController)
│   ├── Camera Offset
│   │   └── Main Camera (Tracked Pose Driver, AudioListener)
│   ├── Left Controller (XR Controller, XR Ray Interactor, XR Direct Interactor)
│   └── Right Controller (XR Controller, XR Ray Interactor, XR Direct Interactor)
└── Locomotion_System
    ├── Teleportation Provider
    ├── Continuous Move Provider
    └── Snap Turn Provider
```

### Scene 4: `AR_Model_Laboratory.unity`
```text
AR_Model_Laboratory (Scene)
├── Directional Light
├── AR Session (Script: ARSession.cs, ARInputManager.cs)
├── AR Session Origin / XROrigin
│   ├── AR Camera (Camera, ARCameraManager.cs, ARCameraBackground.cs, TrackedPoseDriver)
│   ├── AR Plane Manager (Script: ARPlaneManager.cs, Plane Prefab: AR Default Plane)
│   ├── AR Raycast Manager (Script: ARRaycastManager.cs)
│   └── AR_Placement_Handler (Script: ARPlacementManager.cs)
│       - AR Raycast Manager -> AR Raycast Manager
│       - AR Plane Manager -> AR Plane Manager
│       - Placement Reticle Prefab -> AR_Placement_Reticle
├── UI_Canvas [Screen Space - Overlay]
│   ├── Top_HUD (Script: HUDManager.cs)
│   ├── Model_Selector_Tray (Horizontal ScrollView of village models)
│   ├── Btn_ClearPlacement (Button -> ARPlacementManager.ClearPlacedObject)
│   ├── Btn_TogglePlanes (Button -> ARPlaneVisualizerToggle.TogglePlaneVisibility)
│   ├── Btn_CapturePhoto (Button -> ARPhotoCapture.TakeARPhoto)
│   └── Educational_Popup_Modal (Script: EducationalPopupUI.cs)
└── EventSystem
```

---

## 🛠 4. 1-Click Unity Editor Bootstrap Tools

A dedicated editor tool has been provided in `Assets/Scripts/Editor/GramSikhaEditorTools.cs`:

1. In the top Unity menu, click **`Gram Sikha > 1. Generate Village 3D Prefabs`**
   - Automatically generates 5 detailed procedural 3D village assets:
     - `Village_Mud_House.prefab` (earthen walls, thatch roof, verandah pillars)
     - `Primary_School.prefab` (classroom, terracotta tiles, chalkboard)
     - `Village_Hand_Pump.prefab` (concrete pedestal, suction cylinder, lever)
     - `Farm_Tractor.prefab` (engine chassis, big rear wheels, plough)
     - `Village_Banyan_Tree.prefab` (gnarled trunk, sprawling canopy)
2. Click **`Gram Sikha > 2. Generate Educational Data (ScriptableObjects)`**
   - Automatically generates the multilingual `EducationalModelData` assets in `Assets/Resources/EducationalData/`:
     - `MudHouse_Data.asset`
     - `PrimarySchool_Data.asset`
     - `HandPump_Data.asset`
     - `FarmTractor_Data.asset`
     - `BanyanTree_Data.asset`

---

## 🧪 5. Testing & Debugging Guidelines

### A. Testing in Unity Editor (No Headset / No Phone Required)
- **3D Inspector**: Press Play in Unity Editor. Click and drag left mouse button to orbit, scroll mouse wheel to zoom, click on sub-parts (like hand pump lever or tractor plough) to trigger educational highlighting.
- **VR Simulator Fallback**: `VRExplorationRig.cs` includes a built-in keyboard simulator. Press Play in `Village_VR_Tour.unity`:
  - **WASD**: Walk through village paths
  - **Right Click + Mouse**: Look around in 360°
  - **E or Left Click**: Trigger educational card on any village model
- **AR Editor Simulator**: `ARPlacementManager.cs` simulates ground plane hits on `y = 0`. Left click anywhere on screen to place the model.

### B. Building & Testing for VR Headsets (Meta Quest 2 / 3 / Pro, PCVR)
1. In Unity, go to **Project Settings > XR Plug-in Management**.
2. Select **Android** tab (for Quest standalone) or **Standalone** tab (for PCVR / SteamVR).
3. Check **OpenXR**. Under OpenXR Feature Groups, enable **Meta Quest Support** and **Hand Tracking** (if using hands).
4. Go to **File > Build Settings**:
   - Switch platform to **Android**.
   - Texture Compression: **ASTC**.
   - Add Scenes: `MainMenu`, `Village_VR_Tour`.
5. Connect Quest via USB-C (ensure Developer Mode is enabled).
6. Click **Build and Run**. Put on headset and test smooth teleportation, continuous walking, and raycast interactions on the village models.

### C. Building & Testing for Mobile AR (Android ARCore / iOS ARKit)
1. In **Project Settings > XR Plug-in Management**:
   - Android tab: Check **Google ARCore**.
   - iOS tab: Check **Apple ARKit**.
2. In **Player Settings**:
   - Minimum API Level: Android 7.0 (API level 24) or iOS 12.0.
   - Camera Usage Description: *"Gram Sikha requires camera access to project 3D educational village models into your real-world environment."*
3. In **Build Settings**, add `MainMenu` and `AR_Model_Laboratory`.
4. Build `.apk` or export Xcode project. Point camera at a flat table or floor until the green reticle appears, then tap to place.
