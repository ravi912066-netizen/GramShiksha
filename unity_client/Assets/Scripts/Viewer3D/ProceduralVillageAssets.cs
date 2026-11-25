using UnityEngine;

namespace GramSikha.Viewer3D
{
    /// <summary>
    /// Utility class providing procedural generation of interactive village 3D models
    /// (Houses, Schools, Tractors, Hand Pumps, Trees, Infrastructure).
    /// Ensures complete out-of-the-box working functionality in Unity without missing assets.
    /// </summary>
    public static class ProceduralVillageAssets
    {
        public static GameObject CreateVillageHouse(string name = "Village_Mud_House")
        {
            GameObject root = new GameObject(name);

            // Main Mud Walls
            GameObject walls = GameObject.CreatePrimitive(PrimitiveType.Cube);
            walls.name = "Mud_Walls";
            walls.transform.SetParent(root.transform);
            walls.transform.localPosition = new Vector3(0, 1.0f, 0);
            walls.transform.localScale = new Vector3(3.0f, 2.0f, 3.5f);
            SetColor(walls, new Color(0.76f, 0.55f, 0.35f)); // Ochre clay color

            // Thatched Sloping Roof
            GameObject roof = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
            roof.name = "Thatched_Roof";
            roof.transform.SetParent(root.transform);
            roof.transform.localPosition = new Vector3(0, 2.3f, 0);
            roof.transform.localScale = new Vector3(3.6f, 0.6f, 4.0f);
            roof.transform.localRotation = Quaternion.Euler(0, 45, 0);
            SetColor(roof, new Color(0.6f, 0.5f, 0.2f)); // Straw yellow-brown

            // Verandah / Porch Pillars
            CreatePillar(root.transform, new Vector3(-1.4f, 1.0f, 2.2f), "Verandah_Pillar_Left");
            CreatePillar(root.transform, new Vector3(1.4f, 1.0f, 2.2f), "Verandah_Pillar_Right");

            // Wooden Door
            GameObject door = GameObject.CreatePrimitive(PrimitiveType.Cube);
            door.name = "Wooden_Door";
            door.transform.SetParent(root.transform);
            door.transform.localPosition = new Vector3(0, 0.8f, 1.76f);
            door.transform.localScale = new Vector3(0.8f, 1.6f, 0.1f);
            SetColor(door, new Color(0.4f, 0.25f, 0.15f));

            return root;
        }

        public static GameObject CreatePrimarySchool(string name = "Primary_School")
        {
            GameObject root = new GameObject(name);

            // Main Building Block
            GameObject building = GameObject.CreatePrimitive(PrimitiveType.Cube);
            building.name = "School_Building";
            building.transform.SetParent(root.transform);
            building.transform.localPosition = new Vector3(0, 1.5f, 0);
            building.transform.localScale = new Vector3(6.0f, 3.0f, 4.0f);
            SetColor(building, new Color(0.9f, 0.85f, 0.75f)); // Light plaster

            // Tiled Roof
            GameObject roof = GameObject.CreatePrimitive(PrimitiveType.Cube);
            roof.name = "Terracotta_Roof";
            roof.transform.SetParent(root.transform);
            roof.transform.localPosition = new Vector3(0, 3.2f, 0);
            roof.transform.localScale = new Vector3(6.6f, 0.4f, 4.5f);
            SetColor(roof, new Color(0.8f, 0.35f, 0.2f)); // Terracotta red

            // Entrance Verandah
            GameObject verandah = GameObject.CreatePrimitive(PrimitiveType.Cube);
            verandah.name = "Corridor";
            verandah.transform.SetParent(root.transform);
            verandah.transform.localPosition = new Vector3(0, 0.15f, 2.5f);
            verandah.transform.localScale = new Vector3(5.0f, 0.3f, 1.2f);
            SetColor(verandah, new Color(0.6f, 0.6f, 0.6f));

            // School Blackboard / Signboard
            GameObject board = GameObject.CreatePrimitive(PrimitiveType.Cube);
            board.name = "Signboard";
            board.transform.SetParent(root.transform);
            board.transform.localPosition = new Vector3(0, 2.6f, 2.02f);
            board.transform.localScale = new Vector3(2.5f, 0.7f, 0.05f);
            SetColor(board, new Color(0.15f, 0.35f, 0.2f)); // School greenboard

            return root;
        }

        public static GameObject CreateHandPump(string name = "Village_Hand_Pump")
        {
            GameObject root = new GameObject(name);

            // Concrete Base Pedestal
            GameObject basePlatform = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
            basePlatform.name = "Concrete_Platform";
            basePlatform.transform.SetParent(root.transform);
            basePlatform.transform.localPosition = new Vector3(0, 0.15f, 0);
            basePlatform.transform.localScale = new Vector3(2.0f, 0.15f, 2.0f);
            SetColor(basePlatform, new Color(0.7f, 0.7f, 0.72f));

            // Main Cast Iron Body Cylinder
            GameObject body = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
            body.name = "Iron_Cylinder";
            body.transform.SetParent(root.transform);
            body.transform.localPosition = new Vector3(0, 1.0f, 0);
            body.transform.localScale = new Vector3(0.35f, 0.75f, 0.35f);
            SetColor(body, new Color(0.2f, 0.4f, 0.7f)); // Classic blue pump paint

            // Water Spout
            GameObject spout = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
            spout.name = "Water_Spout";
            spout.transform.SetParent(root.transform);
            spout.transform.localPosition = new Vector3(0.35f, 0.85f, 0);
            spout.transform.localScale = new Vector3(0.12f, 0.3f, 0.12f);
            spout.transform.localRotation = Quaternion.Euler(0, 0, -60);
            SetColor(spout, new Color(0.2f, 0.4f, 0.7f));

            // Hand Lever Handle
            GameObject lever = GameObject.CreatePrimitive(PrimitiveType.Cube);
            lever.name = "Pump_Lever_Handle";
            lever.transform.SetParent(root.transform);
            lever.transform.localPosition = new Vector3(-0.7f, 1.55f, 0);
            lever.transform.localScale = new Vector3(1.2f, 0.08f, 0.08f);
            lever.transform.localRotation = Quaternion.Euler(0, 0, -25);
            SetColor(lever, new Color(0.15f, 0.15f, 0.15f)); // Cast iron black

            return root;
        }

        public static GameObject CreateAgriculturalTractor(string name = "Farm_Tractor")
        {
            GameObject root = new GameObject(name);

            // Engine & Body Chassis
            GameObject chassis = GameObject.CreatePrimitive(PrimitiveType.Cube);
            chassis.name = "Engine_Chassis";
            chassis.transform.SetParent(root.transform);
            chassis.transform.localPosition = new Vector3(0, 0.8f, 0);
            chassis.transform.localScale = new Vector3(1.4f, 0.9f, 2.8f);
            SetColor(chassis, new Color(0.85f, 0.15f, 0.15f)); // Classic agricultural red

            // Driver Seat & Canopy Frame
            GameObject canopy = GameObject.CreatePrimitive(PrimitiveType.Cube);
            canopy.name = "Driver_Canopy";
            canopy.transform.SetParent(root.transform);
            canopy.transform.localPosition = new Vector3(0, 2.1f, -0.4f);
            canopy.transform.localScale = new Vector3(1.5f, 0.1f, 1.4f);
            SetColor(canopy, new Color(0.95f, 0.95f, 0.95f));

            // Rear Big Wheels
            CreateWheel(root.transform, new Vector3(-0.9f, 0.75f, -0.6f), new Vector3(0.4f, 0.75f, 0.75f), "Rear_Wheel_Left");
            CreateWheel(root.transform, new Vector3(0.9f, 0.75f, -0.6f), new Vector3(0.4f, 0.75f, 0.75f), "Rear_Wheel_Right");

            // Front Steer Wheels
            CreateWheel(root.transform, new Vector3(-0.8f, 0.45f, 0.9f), new Vector3(0.3f, 0.45f, 0.45f), "Front_Wheel_Left");
            CreateWheel(root.transform, new Vector3(0.8f, 0.45f, 0.9f), new Vector3(0.3f, 0.45f, 0.45f), "Front_Wheel_Right");

            // Attached Cultivator / Plough
            GameObject plough = GameObject.CreatePrimitive(PrimitiveType.Cube);
            plough.name = "Iron_Plough_Attachment";
            plough.transform.SetParent(root.transform);
            plough.transform.localPosition = new Vector3(0, 0.35f, -1.8f);
            plough.transform.localScale = new Vector3(1.6f, 0.3f, 0.8f);
            SetColor(plough, new Color(0.2f, 0.2f, 0.2f));

            return root;
        }

        public static GameObject CreateBanyanTree(string name = "Village_Banyan_Tree")
        {
            GameObject root = new GameObject(name);

            // Massive Central Trunk
            GameObject trunk = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
            trunk.name = "Central_Trunk";
            trunk.transform.SetParent(root.transform);
            trunk.transform.localPosition = new Vector3(0, 1.8f, 0);
            trunk.transform.localScale = new Vector3(1.2f, 1.8f, 1.2f);
            SetColor(trunk, new Color(0.38f, 0.28f, 0.20f));

            // Expansive Leaf Canopies
            GameObject canopyCenter = GameObject.CreatePrimitive(PrimitiveType.Sphere);
            canopyCenter.name = "Foliage_Canopy_Center";
            canopyCenter.transform.SetParent(root.transform);
            canopyCenter.transform.localPosition = new Vector3(0, 4.2f, 0);
            canopyCenter.transform.localScale = new Vector3(4.5f, 2.5f, 4.5f);
            SetColor(canopyCenter, new Color(0.18f, 0.55f, 0.18f));

            GameObject canopyNorth = GameObject.CreatePrimitive(PrimitiveType.Sphere);
            canopyNorth.name = "Foliage_Canopy_North";
            canopyNorth.transform.SetParent(root.transform);
            canopyNorth.transform.localPosition = new Vector3(1.5f, 3.8f, 1.0f);
            canopyNorth.transform.localScale = new Vector3(3.2f, 2.0f, 3.2f);
            SetColor(canopyNorth, new Color(0.15f, 0.48f, 0.15f));

            return root;
        }

        private static void CreatePillar(Transform parent, Vector3 localPos, string name)
        {
            GameObject pillar = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
            pillar.name = name;
            pillar.transform.SetParent(parent);
            pillar.transform.localPosition = localPos;
            pillar.transform.localScale = new Vector3(0.2f, 1.0f, 0.2f);
            SetColor(pillar, new Color(0.85f, 0.75f, 0.6f));
        }

        private static void CreateWheel(Transform parent, Vector3 localPos, Vector3 localScale, string name)
        {
            GameObject wheel = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
            wheel.name = name;
            wheel.transform.SetParent(parent);
            wheel.transform.localPosition = localPos;
            wheel.transform.localScale = localScale;
            wheel.transform.localRotation = Quaternion.Euler(0, 0, 90);
            SetColor(wheel, new Color(0.1f, 0.1f, 0.1f));
        }

        private static void SetColor(GameObject go, Color color)
        {
            Renderer r = go.GetComponent<Renderer>();
            if (r != null)
            {
                Material mat = new Material(Shader.Find("Universal Render Pipeline/Lit") ?? Shader.Find("Standard"));
                mat.color = color;
                r.material = mat;
            }
        }
    }
}
