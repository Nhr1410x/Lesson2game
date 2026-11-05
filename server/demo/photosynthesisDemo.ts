import { LessonData, GameConfig, EvaluationReport, GenerationResponse } from '../../src/types/game.ts';

export const DEMO_LESSON_DATA: LessonData = {
  lesson_title: "Quang hợp ở thực vật",
  subject: "Sinh học",
  grade_level: "Lớp 11",
  summary: "Quang hợp là quá trình lá cây sử dụng năng lượng ánh sáng mặt trời được diệp lục hấp thụ để tổng hợp chất hữu cơ (glucose) từ khí cacbônic (CO2) và nước (H2O), đồng thời giải phóng khí oxy (O2). Quá trình gồm hai pha: pha sáng diễn ra ở màng tilacôit và pha tối (chu trình Canvin) diễn ra ở chất nền stroma của lục lạp.",
  learning_objectives: [
    "Nêu được khái niệm, phương trình tổng quát và vai trò của quang hợp ở thực vật.",
    "Trình bày được cấu tạo của lục lạp thích nghi với chức năng quang hợp.",
    "Phân biệt được vị trí, nguyên liệu và sản phẩm của pha sáng và pha tối trong lục lạp.",
    "Hiểu được các nhân tố môi trường ảnh hưởng đến quang hợp như ánh sáng, nồng độ CO2 và nhiệt độ."
  ],
  key_concepts: [
    {
      concept_id: "c1_pt_tong_quat",
      concept_name: "Phương trình tổng quát của quang hợp",
      explanation: "6 CO2 + 12 H2O + Năng lượng ánh sáng (Diệp lục) -> C6H12O6 + 6 O2 + 6 H2O. Quang hợp chuyển hóa quang năng thành hóa năng trong các liên kết hóa học của chất hữu cơ.",
      source_excerpt: "Phương trình tổng quát: 6CO2 + 12H2O -> C6H12O6 + 6O2 + 6H2O. Khí oxy giải phóng trong quang hợp có nguồn gốc từ sự quang phân ly nước ở pha sáng."
    },
    {
      concept_id: "c2_sac_to_quang_hop",
      concept_name: "Hệ sắc tố quang hợp (Diệp lục & Carotenoid)",
      explanation: "Diệp lục a trực tiếp tham gia chuyển hóa quang năng thành hóa năng trong ATP và NADPH. Diệp lục b và Carotenoid hấp thụ và truyền năng lượng ánh sáng cho diệp lục a ở trung tâm phản ứng.",
      source_excerpt: "Hệ sắc tố gồm diệp lục (chlorophyll a, b) và carotenoit (caroten, xantophin). Sơ đồ truyền năng lượng: Carotenoit -> Diệp lục b -> Diệp lục a -> Diệp lục a trung tâm phản ứng."
    },
    {
      concept_id: "c3_pha_sang",
      concept_name: "Pha sáng của quang hợp",
      explanation: "Pha sáng diễn ra tại màng tilacôit, chỉ diễn ra khi có ánh sáng. Năng lượng ánh sáng dùng để quang phân ly nước giải phóng O2, tổng hợp ATP và NADPH cung cấp cho pha tối.",
      source_excerpt: "Pha sáng diễn ra ở màng tilacôit của lục lạp. Sản phẩm của pha sáng gồm: ATP, NADPH và O2. O2 được thải ra ngoài khí quyển."
    },
    {
      concept_id: "c4_pha_toi_calvin",
      concept_name: "Pha tối (Chu trình Canvin)",
      explanation: "Pha tối diễn ra ở chất nền stroma của lục lạp, không phụ thuộc trực tiếp vào ánh sáng nhưng cần sản phẩm ATP và NADPH của pha sáng để cố định CO2 thành glucose.",
      source_excerpt: "Pha tối diễn ra trong chất nền (stroma) của lục lạp. Chu trình Canvin gồm 3 giai đoạn: cố định CO2, khử APG thành AlPG và tái sinh chất nhận Ribulozo-1,5-điphotphat (RuBP)."
    },
    {
      concept_id: "c5_anh_huong_anh_sang",
      concept_name: "Điểm bù và điểm bão hòa ánh sáng",
      explanation: "Điểm bù ánh sáng là cường độ ánh sáng mà tại đó cường độ quang hợp bằng cường độ hô hấp. Điểm bão hòa ánh sáng là cường độ ánh sáng mà từ đó tăng thêm ánh sáng thì quang hợp cũng không tăng thêm.",
      source_excerpt: "Cường độ quang hợp tăng tỉ lệ thuận với cường độ ánh sáng cho tới điểm bão hòa ánh sáng. Vượt qua điểm này, quang hợp sẽ giảm do tế bào bị tổn thương quang hóa."
    }
  ]
};

export const DEMO_GAME_CONFIG: GameConfig = {
  game_id: "game_demo_photosynthesis_v1",
  game_title: "Thử Thách Quang Hợp: Cuộc Đua Lục Lạp",
  game_type: "quiz_runner",
  difficulty: "medium",
  estimated_duration: "5 phút",
  learning_objectives: [
    "Củng cố kiến thức về bào quan lục lạp và hệ sắc tố",
    "Ghi nhớ nguồn gốc của O2 và sản phẩm pha sáng",
    "Phân biệt pha sáng và pha tối trong lục lạp"
  ],
  questions: [
    {
      question_id: "q1",
      question_text: "Khí Oxy (O2) được giải phóng trong quá trình quang hợp có nguồn gốc từ đâu?",
      options: [
        "Sự khử khí Cacbônic (CO2)",
        "Sự quang phân ly nước (H2O)",
        "Sự phân giải hợp chất Glucose",
        "Sự phân giải phân tử ATP"
      ],
      correct_answer_index: 1,
      explanation: "Chính xác! Trong pha sáng diễn ra ở màng tilacôit, nước bị quang phân ly tạo thành H+, electron và giải phóng khí O2 vào khí quyển.",
      related_concept_id: "c1_pt_tong_quat",
      source_excerpt: "Khí oxy giải phóng trong quang hợp có nguồn gốc từ sự quang phân ly nước ở pha sáng."
    },
    {
      question_id: "q2",
      question_text: "Bào quan nào trong tế bào thực vật là nơi trực tiếp thực hiện quá trình quang hợp?",
      options: [
        "Ti thể (Mitochondria)",
        "Không bào trung tâm",
        "Lục lạp (Chloroplast)",
        "Lưới nội chất hạt"
      ],
      correct_answer_index: 2,
      explanation: "Đúng rồi! Lục lạp chứa hệ sắc tố diệp lục, cấu tạo gồm màng tilacôit (pha sáng) và chất nền stroma (pha tối).",
      related_concept_id: "c2_sac_to_quang_hop",
      source_excerpt: "Quá trình gồm hai pha diễn ra ở màng tilacôit và chất nền stroma của lục lạp."
    },
    {
      question_id: "q3",
      question_text: "Sản phẩm nào của pha sáng được sử dụng trực tiếp để cung cấp năng lượng và nguyên liệu cho pha tối?",
      options: [
        "Khí Oxy và Glucose",
        "ATP và NADPH",
        "H2O và CO2",
        "ADP và NADP+"
      ],
      correct_answer_index: 1,
      explanation: "Xuất sắc! Pha sáng tổng hợp năng lượng ATP và chất khử NADPH để đưa vào chất nền stroma khử CO2 trong chu trình Canvin.",
      related_concept_id: "c3_pha_sang",
      source_excerpt: "Sản phẩm của pha sáng gồm: ATP, NADPH và O2. ATP và NADPH cung cấp năng lượng cho pha tối."
    },
    {
      question_id: "q4",
      question_text: "Pha tối (chu trình Canvin) của quang hợp diễn ra tại vị trí nào trong lục lạp?",
      options: [
        "Màng ngoài của lục lạp",
        "Chất nền (Stroma) của lục lạp",
        "Màng tilacôit (Grana)",
        "Khoang xoang gian màng"
      ],
      correct_answer_index: 1,
      explanation: "Chính xác! Pha sáng diễn ra trên màng tilacôit, còn pha tối diễn ra trong dịch chất nền stroma giàu enzyme.",
      related_concept_id: "c4_pha_toi_calvin",
      source_excerpt: "Pha tối diễn ra trong chất nền (stroma) của lục lạp thông qua chu trình Canvin."
    },
    {
      question_id: "q5",
      question_text: "Sắc tố nào trực tiếp tham gia chuyển hóa năng lượng ánh sáng thành năng lượng hóa học trong phân tử ATP và NADPH?",
      options: [
        "Carotenoid màu vàng cam",
        "Diệp lục b (Chlorophyll b)",
        "Xanthophyll",
        "Diệp lục a ở trung tâm phản ứng"
      ],
      correct_answer_index: 3,
      explanation: "Đúng! Chỉ có diệp lục a ở trung tâm phản ứng mới có khả năng nhường electron để biến đổi quang năng thành hóa năng.",
      related_concept_id: "c2_sac_to_quang_hop",
      source_excerpt: "Diệp lục a trực tiếp tham gia chuyển hóa quang năng thành hóa năng trong ATP và NADPH."
    },
    {
      question_id: "q6",
      question_text: "Điểm bù ánh sáng của thực vật là trạng thái nào sau đây?",
      options: [
        "Cường độ quang hợp đạt mức tối đa không tăng thêm",
        "Cây bắt đầu bị cháy lá do nhiệt độ quá cao",
        "Cường độ quang hợp bằng cường độ hô hấp của cây",
        "Cây ngừng hoàn toàn mọi quá trình trao đổi chất"
      ],
      correct_answer_index: 2,
      explanation: "Rất chuẩn! Tại điểm bù ánh sáng, lượng chất hữu cơ và O2 tạo ra do quang hợp vừa đủ bù đắp cho lượng tiêu hao do hô hấp.",
      related_concept_id: "c5_anh_huong_anh_sang",
      source_excerpt: "Điểm bù ánh sáng là cường độ ánh sáng mà tại đó cường độ quang hợp bằng cường độ hô hấp."
    }
  ]
};

export const DEMO_EVALUATION_REPORT: EvaluationReport = {
  schema_valid: true,
  question_count_valid: true,
  answer_index_valid: true,
  source_grounding_valid: true,
  validation_errors: [],
  retry_count: 0,
  overall_status: "passed"
};

export const DEMO_RESPONSE: GenerationResponse = {
  generation_id: "demo_quang_hop_sinh_hoc_v1",
  processing_status: "completed",
  mode: "demo_mode",
  lesson_data: DEMO_LESSON_DATA,
  game_config: DEMO_GAME_CONFIG,
  evaluation_report: DEMO_EVALUATION_REPORT
};
