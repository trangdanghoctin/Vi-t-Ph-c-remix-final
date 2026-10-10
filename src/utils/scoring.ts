import { Costume, Accessory, ScoreEvaluation, SceneId } from '../types.ts';

/**
 * HỆ THỐNG CHẤM ĐIỂM DỰA TRÊN BỐI CẢNH (calculateAdvancedScore)
 * 
 * Thang điểm tối đa: 100 Điểm
 * - Điểm cơ bản theo trang phục (50 - 60 điểm)
 * - Mỗi phụ kiện hợp Tag / tương thích: +15 đến +25 điểm
 * - Logic độc quyền: Mỗi nhóm phụ kiện (Nón, Trang sức, Giày) tối đa chọn 1 món
 * - Điểm hòa hợp bối cảnh (Background-based Scoring):
 *   + Cảnh 1 (Chốn Bồng Lai): Giao Lĩnh, Áo Tấc, Tràng Vạt (+20đ - Đậm chất tiên khí phiêu bồng)
 *   + Cảnh 2 (Sơn Thần Tế Đàn): Tứ Thân, Dân gian (+20đ); Triều phục vương giả (-10đ vì lạc lõng)
 *   + Cảnh 3 (Cửu Long Cuốn Thư): Nhật Bình, Mã Đoán, Trâm cài (+20đ); Dân gian (-20đ vì lệch phẩm trật)
 */
export function calculateAdvancedScore(
  costume: Costume,
  equippedAccessories: Accessory[],
  scene: SceneId = 'bong-lai'
): ScoreEvaluation {
  let currentScore = costume.baseScore || 50;
  const bonuses: string[] = [`+${currentScore} điểm: Y phục ${costume.name} [${costume.tags.join(', ')}]`];
  const penalties: string[] = [];
  let warningMessage = '';
  let sceneCommentary = '';
  let ruleBreak = false;

  const equippedIds = equippedAccessories.map((a) => a.id);
  const hasMan = equippedIds.includes('man');
  const hasKhanXep = equippedIds.includes('khan-xep');
  const hasNonBaTam = equippedIds.includes('non-ba-tam');
  const hasGuocMoc = equippedIds.includes('guoc-moc');
  const hasTramCaiDa = equippedIds.includes('tram-cai-da');

  // 1. TÍNH ĐIỂM PHỤ KIỆN
  equippedAccessories.forEach((acc) => {
    const isDirectlyCompatible = acc.compatibleCostumeIds.includes(costume.id);
    const hasTagOverlap = acc.tags.some((t) => costume.tags.includes(t));

    if (isDirectlyCompatible || hasTagOverlap) {
      currentScore += acc.scoreBonus;
      bonuses.push(`+${acc.scoreBonus} điểm: Phụ kiện "${acc.name}" phối hợp chuẩn mực cùng ${costume.name}`);
    } else {
      const neutralBonus = Math.max(10, acc.scoreBonus - 10);
      currentScore += neutralBonus;
      bonuses.push(`+${neutralBonus} điểm: Phụ kiện "${acc.name}" tăng tính thẩm mỹ`);
    }
  });

  // 2. TÍNH ĐIỂM THEO BỐI CẢNH (BACKGROUND-BASED SCORING)
  const isRoyal =
    costume.id === 'ao-ma-doan' ||
    costume.id === 'ao-nhat-binh' ||
    costume.tags.includes('Triều phục') ||
    costume.tags.includes('Vương giả') ||
    hasTramCaiDa;

  const isFolk =
    costume.id === 'ao-tu-than' ||
    costume.tags.includes('Dân gian') ||
    costume.tags.includes('Lao động') ||
    hasNonBaTam ||
    hasGuocMoc;

  const isEthereal =
    costume.id === 'ao-giao-linh' ||
    costume.id === 'ao-tac' ||
    costume.id === 'ao-tac-nam' ||
    costume.id === 'ao-trang-vat' ||
    costume.tags.includes('Cổ phong') ||
    costume.tags.includes('Lễ nghi');

  if (scene === 'bong-lai') {
    // CẢNH 1: CHỐN BỒNG LAI (MÂY HỒNG CAM)
    if (isEthereal) {
      currentScore += 20;
      bonuses.push('+20 điểm: Tà áo phiêu bồng đậm chất tiên khí chốn bồng lai');
      sceneCommentary = `Bộ ${costume.name} với tà áo thướt tha tung bay giữa chốn bồng lai mây hồng thật đẹp, toát lên phong thái thoát tục phiêu bồng.`;
    } else if (isFolk) {
      currentScore += 10;
      bonuses.push('+10 điểm: Nét mộc mạc hòa cùng thiên nhiên bồng lai');
      sceneCommentary = `Tà áo ${costume.name} chất phác giữa mây hồng bồng lai mang phong vị thanh bình, khoáng đạt.`;
    } else {
      currentScore += 15;
      bonuses.push('+15 điểm: Hoàng y tráng lệ giữa mây trời');
      sceneCommentary = `Sắc áo ${costume.name} rực rỡ hòa cùng ráng mây hồng cam tạo nên khung cảnh tráng lệ phi thường.`;
    }
  } else if (scene === 'son-than') {
    // CẢNH 2: SƠN THẦN TẾ ĐÀN (RỪNG SÂU HUYỀN BÍ)
    if (isFolk || costume.tags.includes('Lao động') || hasGuocMoc) {
      currentScore += 20;
      bonuses.push('+20 điểm: Thấm đượm linh khí đại ngàn và tế đàn trống thiêng');
      sceneCommentary = `Bộ ${costume.name} khỏe khoắn, mộc mạc hòa quyện trọn vẹn cùng âm vang trống thiêng và linh khí sơn hà nơi tế đàn.`;
    } else if (isRoyal) {
      currentScore -= 10;
      ruleBreak = true;
      penalties.push('-10 điểm: Triều phục quyền quý có phần xa lạ chốn rừng thiêng');
      warningMessage = 'Cảnh báo: Y phục vương giả cung đình có phần xa lạ và gò bó giữa không gian tế đàn sơn thần huyền bí.';
      sceneCommentary = `Bộ y phục ${costume.name} quá xa hoa, có phần lạc lõng giữa rừng sâu đại ngàn trầm mặc.`;
    } else {
      currentScore += 10;
      bonuses.push('+10 điểm: Tề chỉnh trang nghiêm nơi tế đàn');
      sceneCommentary = `${costume.name} ngay ngắn, trang nghiêm hướng về linh khí non sông.`;
    }
  } else if (scene === 'cuu-long') {
    // CẢNH 3: CỬU LONG CUỐN THƯ (UY NGHIÊM RỒNG PHƯỢNG)
    if (isRoyal) {
      currentScore += 20;
      bonuses.push('+20 điểm: Uy nghiêm tráng lệ trước thánh chỉ Cửu Long cuốn thư');
      sceneCommentary = `Y phục vương giả ${costume.name} uy nghiêm tuyệt đỉnh, xứng danh bậc đế vương hậu phi trước thánh chỉ cuốn thư dát vàng rồng phượng!`;
    } else if (isFolk) {
      currentScore -= 20;
      ruleBreak = true;
      penalties.push('-20 điểm: Lệch phẩm trật (Y phục dân gian không đủ phẩm cấp trước rồng phượng uy nghiêm)');
      warningMessage = 'Cảnh báo phẩm trật: Y phục dân gian không tương xứng với uy nghi rồng phượng và thánh chỉ hoàng gia!';
      sceneCommentary = `Bộ ${costume.name} dân dã tuy đẹp nơi thôn dã, nhưng đứng trước Cửu Long cuốn thư thì e là chưa đủ phẩm hàm uy nghiêm.`;
    } else {
      currentScore += 15;
      bonuses.push('+15 điểm: Chuẩn mực hoàng triều');
      sceneCommentary = `${costume.name} đoan trang tề chỉnh, hòa vào hào khí thịnh thế rực rỡ.`;
    }
  } else if (scene === 'cung-dinh') {
    if (isRoyal) {
      currentScore += 20;
      bonuses.push('+20 điểm: Bối cảnh Sảnh Cung Đình tôn vinh phẩm hàm vương giả');
      sceneCommentary = `${costume.name} uy nghiêm nơi chánh điện đại triều sơn son thếp vàng.`;
    } else if (isFolk) {
      currentScore -= 30;
      ruleBreak = true;
      penalties.push('-30 điểm: Phạm húy triều đình');
      warningMessage = 'Cảnh báo phạm húy: Trang phục dân gian không đủ trang trọng để bước vào sảnh chánh điện cung đình!';
      sceneCommentary = 'Chiếc y phục dân dã nếu bước vào cung đình thâm nghiêm thì e là phạm phép tắc triều cương.';
    }
  } else {
    // Đầm Sen / Phố Cổ fallback
    if (isFolk || isEthereal) {
      currentScore += 15;
      sceneCommentary = `Tà áo ${costume.name} duyên dáng hòa vào khung cảnh thơ mộng hữu tình.`;
    }
  }

  // 3. LUẬT PHẠT KẾT HỢP PHỤ KIỆN
  if ((costume.id === 'ao-ma-doan' || costume.id === 'ao-nhat-binh') && (hasGuocMoc || hasNonBaTam)) {
    currentScore -= 50;
    ruleBreak = true;
    penalties.push('-50 điểm: Lệch chuẩn triều cương (Vật phẩm dân gian không phối cùng triều phục)');
    if (!warningMessage) {
      warningMessage = 'Cảnh báo: Vật phẩm dân gian không phối cùng triều phục! Áo Mã Đoán và Áo Nhật Bình tuyệt đối không phối cùng Guốc Mộc hay Nón Ba Tầm.';
    }
  }

  if (costume.id === 'ao-tu-than' && hasTramCaiDa) {
    currentScore -= 30;
    ruleBreak = true;
    penalties.push('-30 điểm: Trâm cài cung đình không hợp với trang phục dân gian tứ thân');
    if (!warningMessage) {
      warningMessage = 'Cảnh báo: Trâm cài cung đình gắn đá quý không hợp với Áo Tứ Thân chất phác nơi thôn dã! Hãy thay bằng Nón Ba Tầm hoặc Quai Thao.';
    }
  }

  if (costume.id === 'ao-tac' || costume.id === 'ao-tac-nam') {
    const hasHeadgear = costume.gender === 'male' ? hasKhanXep : (hasMan || hasKhanXep);
    if (!hasHeadgear) {
      currentScore -= 20;
      ruleBreak = true;
      penalties.push('-20 điểm: Áo Tấc thiếu Mấn/Khăn Đóng trang trọng');
      if (!warningMessage) {
        warningMessage = 'Áo Tấc là y phục dùng trong các đại lễ trang nghiêm. Đừng quên đội thêm Khăn đóng hoặc Mấn để tổng thể thêm phần tôn kính.';
      }
    }
  }

  // Khống chế từ 0 đến 100 điểm
  currentScore = Math.max(0, Math.min(100, currentScore));

  let status: 'perfect' | 'good' | 'warning' | 'danger' = 'good';
  let title = 'Phối Đồ Khá Hài Hòa';
  let feedback = warningMessage || sceneCommentary;

  if (currentScore < 50) {
    status = 'danger';
    title = '🚨 Cảnh Báo Lệch Chuẩn Bối Cảnh!';
    if (!feedback) {
      feedback = 'Cách phối đồ hoặc bối cảnh hiện tại chưa đúng chuẩn mực văn hóa lịch sử!';
    }
  } else if (currentScore === 100) {
    status = 'perfect';
    title = '🌟 Tuyệt Phẩm Đại Việt 100/100';
    feedback = `Tuyệt mỹ! ${sceneCommentary} Từng chi tiết phụ kiện và y phục đều chuẩn xác với bối cảnh!`;
  } else if (ruleBreak) {
    status = 'warning';
    title = '⚠️ Cần Điều Chỉnh Phụ Kiện & Bối Cảnh';
  } else {
    status = 'good';
    title = '✨ Y Phục Hài Hòa Cảnh Sắc';
    if (!feedback) {
      feedback = sceneCommentary || 'Y phục chỉn chu, màu sắc tao nhã, hòa hợp cùng bối cảnh cổ truyền.';
    }
  }

  return {
    score: currentScore,
    status,
    title,
    feedback,
    sceneCommentary,
    ruleBreak,
    bonuses,
    penalties,
  };
}

// Alias tương thích ngược
export const calculateScore = calculateAdvancedScore;
