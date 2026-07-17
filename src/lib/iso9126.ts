/**
 * Model Kualitas Perangkat Lunak ISO/IEC 9126
 * Enam karakteristik utama beserta sub-karakteristiknya.
 */

export type ScoreValue = 1 | 2 | 3 | 4 | 5;

export interface SubCharacteristic {
  id: string;
  name: string;
  nameId: string;
  description: string;
}

export interface Characteristic {
  id: string;
  name: string;
  nameId: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
  subCharacteristics: SubCharacteristic[];
}

export const ISO_9126_CHARACTERISTICS: Characteristic[] = [
  {
    id: "functionality",
    name: "Functionality",
    nameId: "Fungsionalitas",
    description:
      "Kemampuan perangkat lunak untuk menyediakan fungsi yang memenuhi kebutuhan yang dinyatakan dan tersirat ketika digunakan pada kondisi tertentu.",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    icon: "⚙️",
    subCharacteristics: [
      {
        id: "suitability",
        name: "Suitability",
        nameId: "Kesesuaian",
        description:
          "Kemampuan perangkat lunak menyediakan rangkaian fungsi yang sesuai untuk tugas dan tujuan pengguna.",
      },
      {
        id: "accuracy",
        name: "Accuracy",
        nameId: "Akurasi",
        description:
          "Kemampuan perangkat lunak memberikan hasil yang benar atau sesuai dengan tingkat ketepatan yang dibutuhkan.",
      },
      {
        id: "interoperability",
        name: "Interoperability",
        nameId: "Interoperabilitas",
        description:
          "Kemampuan perangkat lunak berinteraksi dengan satu atau lebih sistem yang ditentukan.",
      },
      {
        id: "security",
        name: "Security",
        nameId: "Keamanan",
        description:
          "Kemampuan melindungi informasi dan data agar orang/sistem yang tidak berwenang tidak dapat membaca atau memodifikasinya.",
      },
      {
        id: "functionality-compliance",
        name: "Compliance",
        nameId: "Kepatuhan Fungsional",
        description:
          "Kemampuan perangkat lunak mematuhi standar, konvensi, atau regulasi terkait fungsionalitas.",
      },
    ],
  },
  {
    id: "reliability",
    name: "Reliability",
    nameId: "Keandalan",
    description:
      "Kemampuan perangkat lunak untuk mempertahankan tingkat kinerja yang ditentukan ketika digunakan dalam kondisi tertentu.",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    icon: "🛡️",
    subCharacteristics: [
      {
        id: "maturity",
        name: "Maturity",
        nameId: "Kematangan",
        description:
          "Kemampuan perangkat lunak menghindari kegagalan akibat kesalahan dalam perangkat lunak.",
      },
      {
        id: "fault-tolerance",
        name: "Fault Tolerance",
        nameId: "Toleransi Kesalahan",
        description:
          "Kemampuan mempertahankan tingkat kinerja yang ditentukan jika terjadi kesalahan perangkat lunak atau pelanggaran antarmuka.",
      },
      {
        id: "recoverability",
        name: "Recoverability",
        nameId: "Kemampuan Pulih",
        description:
          "Kemampuan memulihkan data yang terpengaruh dan membangun kembali tingkat kinerja yang diinginkan setelah kegagalan.",
      },
      {
        id: "reliability-compliance",
        name: "Compliance",
        nameId: "Kepatuhan Keandalan",
        description:
          "Kemampuan mematuhi standar, konvensi, atau regulasi terkait keandalan.",
      },
    ],
  },
  {
    id: "usability",
    name: "Usability",
    nameId: "Kebergunaan",
    description:
      "Kemampuan perangkat lunak untuk dipahami, dipelajari, digunakan, dan menarik bagi pengguna ketika digunakan dalam kondisi tertentu.",
    color: "text-violet-700",
    bgColor: "bg-violet-50",
    borderColor: "border-violet-200",
    icon: "👤",
    subCharacteristics: [
      {
        id: "understandability",
        name: "Understandability",
        nameId: "Dapat Dipahami",
        description:
          "Kemampuan perangkat lunak memungkinkan pengguna memahami apakah perangkat lunak cocok dan bagaimana dapat digunakan untuk tugas tertentu.",
      },
      {
        id: "learnability",
        name: "Learnability",
        nameId: "Dapat Dipelajari",
        description:
          "Kemampuan perangkat lunak memungkinkan pengguna mempelajari penerapannya.",
      },
      {
        id: "operability",
        name: "Operability",
        nameId: "Dapat Dioperasikan",
        description:
          "Kemampuan perangkat lunak memungkinkan pengguna mengoperasikan dan mengendalikannya.",
      },
      {
        id: "attractiveness",
        name: "Attractiveness",
        nameId: "Daya Tarik",
        description:
          "Kemampuan perangkat lunak menarik bagi pengguna (aspek antarmuka visual).",
      },
      {
        id: "usability-compliance",
        name: "Compliance",
        nameId: "Kepatuhan Kebergunaan",
        description:
          "Kemampuan mematuhi standar, konvensi, panduan gaya, atau regulasi terkait kebergunaan.",
      },
    ],
  },
  {
    id: "efficiency",
    name: "Efficiency",
    nameId: "Efisiensi",
    description:
      "Kemampuan perangkat lunak memberikan kinerja yang sesuai relatif terhadap jumlah sumber daya yang digunakan dalam kondisi tertentu.",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    icon: "⚡",
    subCharacteristics: [
      {
        id: "time-behavior",
        name: "Time Behavior",
        nameId: "Perilaku Waktu",
        description:
          "Kemampuan memberikan waktu respons dan throughput yang sesuai saat menjalankan fungsinya.",
      },
      {
        id: "resource-utilization",
        name: "Resource Utilization",
        nameId: "Pemanfaatan Sumber Daya",
        description:
          "Kemampuan menggunakan jumlah dan jenis sumber daya yang sesuai saat menjalankan fungsinya.",
      },
      {
        id: "efficiency-compliance",
        name: "Compliance",
        nameId: "Kepatuhan Efisiensi",
        description:
          "Kemampuan mematuhi standar atau konvensi terkait efisiensi.",
      },
    ],
  },
  {
    id: "maintainability",
    name: "Maintainability",
    nameId: "Pemeliharaan",
    description:
      "Kemampuan perangkat lunak untuk dimodifikasi. Modifikasi dapat mencakup koreksi, perbaikan, atau adaptasi terhadap perubahan lingkungan, persyaratan, dan spesifikasi fungsional.",
    color: "text-rose-700",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200",
    icon: "🔧",
    subCharacteristics: [
      {
        id: "analyzability",
        name: "Analyzability",
        nameId: "Dapat Dianalisis",
        description:
          "Kemampuan didiagnosis untuk kekurangan atau penyebab kegagalan, atau untuk mengidentifikasi bagian yang akan dimodifikasi.",
      },
      {
        id: "changeability",
        name: "Changeability",
        nameId: "Dapat Diubah",
        description:
          "Kemampuan memungkinkan implementasi modifikasi tertentu.",
      },
      {
        id: "stability",
        name: "Stability",
        nameId: "Stabilitas",
        description:
          "Kemampuan menghindari efek tak terduga dari modifikasi perangkat lunak.",
      },
      {
        id: "testability",
        name: "Testability",
        nameId: "Dapat Diuji",
        description:
          "Kemampuan memungkinkan validasi perangkat lunak yang dimodifikasi.",
      },
      {
        id: "maintainability-compliance",
        name: "Compliance",
        nameId: "Kepatuhan Pemeliharaan",
        description:
          "Kemampuan mematuhi standar atau konvensi terkait pemeliharaan.",
      },
    ],
  },
  {
    id: "portability",
    name: "Portability",
    nameId: "Portabilitas",
    description:
      "Kemampuan perangkat lunak untuk ditransfer dari satu lingkungan ke lingkungan lain.",
    color: "text-cyan-700",
    bgColor: "bg-cyan-50",
    borderColor: "border-cyan-200",
    icon: "📦",
    subCharacteristics: [
      {
        id: "adaptability",
        name: "Adaptability",
        nameId: "Adaptabilitas",
        description:
          "Kemampuan beradaptasi ke lingkungan yang berbeda tanpa menerapkan tindakan atau sarana selain yang disediakan untuk tujuan ini.",
      },
      {
        id: "installability",
        name: "Installability",
        nameId: "Dapat Diinstal",
        description:
          "Kemampuan diinstal di lingkungan yang ditentukan.",
      },
      {
        id: "co-existence",
        name: "Co-existence",
        nameId: "Koeksistensi",
        description:
          "Kemampuan berdampingan dengan perangkat lunak independen lainnya di lingkungan bersama dengan berbagi sumber daya umum.",
      },
      {
        id: "replaceability",
        name: "Replaceability",
        nameId: "Dapat Diganti",
        description:
          "Kemampuan digunakan sebagai pengganti perangkat lunak lain untuk tujuan yang sama di lingkungan yang sama.",
      },
      {
        id: "portability-compliance",
        name: "Compliance",
        nameId: "Kepatuhan Portabilitas",
        description:
          "Kemampuan mematuhi standar atau konvensi terkait portabilitas.",
      },
    ],
  },
];

export const SCORE_LABELS: Record<ScoreValue, { label: string; color: string }> = {
  1: { label: "Sangat Buruk", color: "text-red-600" },
  2: { label: "Buruk", color: "text-orange-600" },
  3: { label: "Cukup", color: "text-yellow-600" },
  4: { label: "Baik", color: "text-lime-600" },
  5: { label: "Sangat Baik", color: "text-green-600" },
};

export function getAllSubCharacteristicIds(): string[] {
  return ISO_9126_CHARACTERISTICS.flatMap((c) =>
    c.subCharacteristics.map((s) => s.id)
  );
}

export function createEmptyScores(): Record<string, ScoreValue | null> {
  const scores: Record<string, ScoreValue | null> = {};
  for (const id of getAllSubCharacteristicIds()) {
    scores[id] = null;
  }
  return scores;
}
