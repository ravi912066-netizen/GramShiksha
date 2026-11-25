#if UNITY_EDITOR
using System.IO;
using UnityEngine;
using UnityEditor;
using GramSikha.Core;
using GramSikha.Data;
using GramSikha.Viewer3D;

namespace GramSikha.EditorTools
{
    public static class GramSikhaEditorTools
    {
        private const string PrefabsPath = "Assets/Prefabs";
        private const string DataPath = "Assets/Resources/EducationalData";

        [MenuItem("Gram Sikha/1. Generate Village 3D Prefabs", false, 1)]
        public static void GeneratePrefabs()
        {
            EnsureDirectory(PrefabsPath);

            SavePrefab(ProceduralVillageAssets.CreateVillageHouse("Village_Mud_House"), $"{PrefabsPath}/Village_Mud_House.prefab");
            SavePrefab(ProceduralVillageAssets.CreatePrimarySchool("Primary_School"), $"{PrefabsPath}/Primary_School.prefab");
            SavePrefab(ProceduralVillageAssets.CreateHandPump("Village_Hand_Pump"), $"{PrefabsPath}/Village_Hand_Pump.prefab");
            SavePrefab(ProceduralVillageAssets.CreateAgriculturalTractor("Farm_Tractor"), $"{PrefabsPath}/Farm_Tractor.prefab");
            SavePrefab(ProceduralVillageAssets.CreateBanyanTree("Village_Banyan_Tree"), $"{PrefabsPath}/Village_Banyan_Tree.prefab");

            AssetDatabase.SaveAssets();
            AssetDatabase.Refresh();
            EditorUtility.DisplayDialog("Gram Sikha", "Village 3D Prefabs successfully created in " + PrefabsPath, "OK");
        }

        [MenuItem("Gram Sikha/2. Generate Educational Data (ScriptableObjects)", false, 2)]
        public static void GenerateEducationalData()
        {
            EnsureDirectory(DataPath);

            CreateMudHouseData();
            CreateSchoolData();
            CreateHandPumpData();
            CreateTractorData();
            CreateBanyanTreeData();

            AssetDatabase.SaveAssets();
            AssetDatabase.Refresh();
            EditorUtility.DisplayDialog("Gram Sikha", "Educational ScriptableObjects created in " + DataPath, "OK");
        }

        private static void CreateMudHouseData()
        {
            EducationalModelData asset = ScriptableObject.CreateInstance<EducationalModelData>();
            asset.modelId = "house_mud_traditional";
            asset.titleEnglish = "Traditional Mud House (Kachha Ghar)";
            asset.titleHindi = "पारंपरिक मिट्टी का घर (कच्चा घर)";
            asset.category = ModelCategory.Housing;
            asset.recommendedARScale = 0.25f;
            asset.recommendedViewerScale = 1.0f;

            asset.descriptionEnglish = "Traditional rural earthen dwellings crafted from locally sourced clay, straw, cow dung, and bamboo. Naturally insulated to maintain cool temperatures in intense summers and warmth during chilly winters.";
            asset.descriptionHindi = "स्थानीय मिट्टी, पुआल और बांस से निर्मित पारंपरिक ग्रामीण आवास। यह प्राकृतिक रूप से गर्मियों में ठंडा और सर्दियों में गर्म रहता है।";

            asset.historicalSignificanceEn = "Practiced across the Indian subcontinent for over 4,000 years, showcasing zero-carbon vernacular architecture.";
            asset.historicalSignificanceHi = "4000 वर्षों से अधिक पुरानी भारतीय वास्तुकला, जो शून्य कार्बन उत्सर्जन और पर्यावरण अनुकूलता का उदाहरण है।";

            asset.practicalUtilityEn = "Thermal insulation, biodegradeable construction, earthquake resistance due to flexible wooden and bamboo rafters.";
            asset.practicalUtilityHi = "प्राकृतिक तापीय इन्सुलेशन, पर्यावरण-अनुकूल विघटन और भूकंप प्रतिरोधी लचीलापन।";

            asset.keyFactsEnglish.Add("Mud walls regulate indoor humidity and temperature naturally.");
            asset.keyFactsEnglish.Add("Thatch roof is sloped at 45 degrees for swift monsoon runoff.");
            asset.keyFactsHindi.Add("मिट्टी की दीवारें घर के तापमान और आर्द्रता को संतुलित रखती हैं।");
            asset.keyFactsHindi.Add("घास-फूस की ढलान वाली छत मानसून के पानी को तुरंत बहा देती है।");

            asset.prefab = AssetDatabase.LoadAssetAtPath<GameObject>($"{PrefabsPath}/Village_Mud_House.prefab");

            SaveScriptableObject(asset, $"{DataPath}/MudHouse_Data.asset");
        }

        private static void CreateSchoolData()
        {
            EducationalModelData asset = ScriptableObject.CreateInstance<EducationalModelData>();
            asset.modelId = "school_primary_rural";
            asset.titleEnglish = "Village Primary School (Prathmik Vidyalaya)";
            asset.titleHindi = "प्राथमिक विद्यालय (गाँव का स्कूल)";
            asset.category = ModelCategory.Education;
            asset.recommendedARScale = 0.2f;
            asset.recommendedViewerScale = 0.8f;

            asset.descriptionEnglish = "The foundational pillar of rural literacy and development. Offers primary education, midday meals, and community gathering grounds for children in villages.";
            asset.descriptionHindi = "ग्रामीण साक्षरता और बाल विकास की रीढ़। यहाँ बच्चों को बुनियादी शिक्षा और पोषण युक्त मध्याह्न भोजन (Midday Meal) प्रदान किया जाता है।";

            asset.historicalSignificanceEn = "Established post-independence under Right to Education (RTE) to ensure every rural child receives foundational learning.";
            asset.historicalSignificanceHi = "शिक्षा का अधिकार (RTE) कानून के तहत हर ग्रामीण बच्चे तक प्राथमिक शिक्षा पहुँचाने का केंद्र।";

            asset.keyFactsEnglish.Add("Provides mid-day nutrition meals supporting physical and mental development.");
            asset.keyFactsEnglish.Add("Acts as an election polling booth and disaster shelter during emergencies.");
            asset.keyFactsHindi.Add("बच्चों के शारीरिक व मानसिक विकास हेतु पौष्टिक मध्याह्न भोजन प्रदान करता है।");
            asset.keyFactsHindi.Add("आपदा के समय राहत शिविर तथा चुनावों में मतदान केंद्र के रूप में प्रयुक्त।");

            asset.prefab = AssetDatabase.LoadAssetAtPath<GameObject>($"{PrefabsPath}/Primary_School.prefab");

            SaveScriptableObject(asset, $"{DataPath}/PrimarySchool_Data.asset");
        }

        private static void CreateHandPumpData()
        {
            EducationalModelData asset = ScriptableObject.CreateInstance<EducationalModelData>();
            asset.modelId = "water_handpump_india_mark_2";
            asset.titleEnglish = "Deep Well Hand Pump (India Mark II)";
            asset.titleHindi = "हैंडपंप (इंडिया मार्क-II)";
            asset.category = ModelCategory.WaterResource;
            asset.recommendedARScale = 0.4f;
            asset.recommendedViewerScale = 1.2f;

            asset.descriptionEnglish = "A human-powered positive displacement piston pump engineered to lift clean potable drinking water from deep underground aquifers (up to 50 meters).";
            asset.descriptionHindi = "मानव शक्ति चालित डीप-वेल पिस्टन पंप, जो 50 मीटर तक गहरे भूजल से शुद्ध पेयजल निकालने के लिए उपयोग किया जाता है।";

            asset.practicalUtilityEn = "Mechanically converts downward lever stroke into upward piston suction, drawing groundwater into the cylinder and out through the spout.";
            asset.practicalUtilityHi = "यांत्रिक लीवर क्रिया द्वारा पिस्टन चूषण (suction) उत्पन्न कर भूजल को सतह पर लाता है।";

            asset.keyFactsEnglish.Add("Requires no electricity; fully operational during power outages.");
            asset.keyFactsEnglish.Add("Standardized worldwide by UNICEF for rural hygiene and sanitation.");
            asset.keyFactsHindi.Add("बिजली के बिना संचालित होता है; 24 घंटे उपलब्ध पेयजल स्रोत।");
            asset.keyFactsHindi.Add("यूनिसेफ द्वारा ग्रामीण स्वास्थ्य और स्वच्छता के लिए मानकीकृत डिजाइन।");

            asset.prefab = AssetDatabase.LoadAssetAtPath<GameObject>($"{PrefabsPath}/Village_Hand_Pump.prefab");

            SaveScriptableObject(asset, $"{DataPath}/HandPump_Data.asset");
        }

        private static void CreateTractorData()
        {
            EducationalModelData asset = ScriptableObject.CreateInstance<EducationalModelData>();
            asset.modelId = "agri_tractor_mechanization";
            asset.titleEnglish = "Agricultural Tractor & Cultivator";
            asset.titleHindi = "कृषि ट्रैक्टर और कल्टीवेटर";
            asset.category = ModelCategory.Agriculture;
            asset.recommendedARScale = 0.3f;
            asset.recommendedViewerScale = 1.0f;

            asset.descriptionEnglish = "High-torque diesel engine vehicle providing motive power for tilling, ploughing, seeding, and hauling agricultural produce across farmland.";
            asset.descriptionHindi = "उच्च टॉर्क डीजल चालित कृषि वाहन, जो खेत जोतने, बीज बोने और फसल परिवहन में क्रांति लाता है।";

            asset.keyFactsEnglish.Add("Replaces draft animals, increasing field plowing efficiency by 10x.");
            asset.keyFactsEnglish.Add("Power Take-Off (PTO) shaft drives stationary farm machinery like threshers and water pumps.");
            asset.keyFactsHindi.Add("पारंपरिक बैलों की तुलना में 10 गुना तेजी से जुताई संपन्न करता है।");
            asset.keyFactsHindi.Add("पीटीओ (PTO) शाफ्ट से थ्रेशर और सिंचाई पंप भी संचालित किए जा सकते हैं।");

            asset.prefab = AssetDatabase.LoadAssetAtPath<GameObject>($"{PrefabsPath}/Farm_Tractor.prefab");

            SaveScriptableObject(asset, $"{DataPath}/FarmTractor_Data.asset");
        }

        private static void CreateBanyanTreeData()
        {
            EducationalModelData asset = ScriptableObject.CreateInstance<EducationalModelData>();
            asset.modelId = "tree_sacred_banyan";
            asset.titleEnglish = "Sacred Banyan Tree (Ficus benghalensis)";
            asset.titleHindi = "बरगद का पेड़ (वटवृक्ष)";
            asset.category = ModelCategory.FloraAndFauna;
            asset.recommendedARScale = 0.15f;
            asset.recommendedViewerScale = 0.6f;

            asset.descriptionEnglish = "The national tree of India and the traditional village gathering canopy (Chaupal). Characterized by aerial prop roots that grow downward into supportive auxiliary trunks.";
            asset.descriptionHindi = "भारत का राष्ट्रीय वृक्ष और गाँव की चौपाल का केंद्र। इसकी शाखाओं से निकलने वाली जटाएं (वायवीय जड़ें) इसे शताब्दियों तक जीवित रखती हैं।";

            asset.keyFactsEnglish.Add("Produces dense oxygen canopy and shelters hundreds of rural bird species.");
            asset.keyFactsEnglish.Add("Traditional community Panchayat meetings gather under its cooling shade.");
            asset.keyFactsHindi.Add("सघन छाया और प्रचुर ऑक्सीजन प्रदान करता है; सैकड़ों पक्षियों का आश्रय।");
            asset.keyFactsHindi.Add("गाँव की पारंपरिक पंचायत और सामाजिक चर्चाएं इसी की छाया में आयोजित होती हैं।");

            asset.prefab = AssetDatabase.LoadAssetAtPath<GameObject>($"{PrefabsPath}/Village_Banyan_Tree.prefab");

            SaveScriptableObject(asset, $"{DataPath}/BanyanTree_Data.asset");
        }

        private static void SavePrefab(GameObject go, string path)
        {
            PrefabUtility.SaveAsPrefabAsset(go, path);
            GameObject.DestroyImmediate(go);
        }

        private static void SaveScriptableObject(ScriptableObject obj, string path)
        {
            AssetDatabase.CreateAsset(obj, path);
        }

        private static void EnsureDirectory(string relativePath)
        {
            if (!Directory.Exists(relativePath))
            {
                Directory.CreateDirectory(relativePath);
            }
        }
    }
}
#endif
