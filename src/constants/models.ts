import Model350Icon from "@/Icon/model350Icon";
import Model500Icon from "@/Icon/model500Icon";
import modelBiLSTMIcon from "@/Icon/modelBiLSTMIcon";

export const modelData = [
  {
    id: "arvie-350", // Ensure unique ID
    name: "Arvie 350",
    title: "Violence Detection",
    description: "ONNX-based Violence Detection trained on 700 videos",
    status: "MobileNetV2",
    zones: 6,
    latency: "40ms",
    accuracy: "92%",
    evaluation: {
      precision: "91%",
      recall: "89%",
      f1Score: "90%",
    },
    lastUpdated: "6 Weeks Ago",
    logo: Model350Icon,
    modelPath: "/models/model350.onnx",
  },
  {
    id: "arvie-500", // Ensure unique ID
    name: "Arvie 500",
    title: "Violence Detection",
    description:
      "ONNX-based model trained on 1000 curated violent/non-violent clips",
    status: "MobileNetV2",
    zones: 8,
    latency: "35ms",
    accuracy: "94%",
    evaluation: {
      precision: "95%",
      recall: "93%",
      f1Score: "94%",
    },
    lastUpdated: "2 Weeks Ago",
    logo: Model500Icon,
    modelPath: "/models/500model.onnx",
  },
  {
    id: "arvie-bilstm", // Ensure unique ID
    name: "Arvie BiLSTM (Beta)",
    title: "Violence Detection",
    description:
      "Experimental BiLSTM-based sequence model for aggression patterns",
    status: "MobileNetV2 + BiLSTM (Beta)",
    zones: 4,
    latency: "60ms",
    accuracy: "87%",
    evaluation: {
      precision: "85%",
      recall: "82%",
      f1Score: "83%",
    },
    lastUpdated: "1 Week Ago",
    logo: modelBiLSTMIcon,
    modelPath: "/models/bilstm.onnx",
  },
  {
    id: "arvie-mobilenet-v3", // Unique ID for the new model
    name: "Arvie MobileNetV3 (Beta)",
    title: "Violence Detection",
    description:
      "Advanced MobileNetV3-based model for detecting violent patterns and aggressive behavior",
    status: "MobileNetV3Small",
    zones: 4,
    latency: "38ms",
    accuracy: "89%",
    evaluation: {
      precision: "89%",
      recall: "89%",
      f1Score: "89%",
    },
    lastUpdated: "Just now",
    logo: Model500Icon,
    modelPath: "/models/model50kv3.onnx",
  },
];
