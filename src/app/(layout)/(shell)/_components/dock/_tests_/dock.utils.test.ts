import { DOCK_CONFIG } from "../dock.constants";
import { calculateIconStyle, getDockClasses } from "../dock.utils";

describe("calculateIconStyle", () => {
  const baseRect = {
    left: 100,
    width: 40,
  } as DOMRect;

  test("마우스가 아이콘 중앙에 있을 때 최대 scale과 translateY가 적용된다", () => {
    const centerX = baseRect.left + baseRect.width / 2;
    const { scale, translateY } = calculateIconStyle(centerX, baseRect);

    expect(scale).toBeCloseTo(DOCK_CONFIG.SCALE_MAX);
    expect(translateY).toBeCloseTo(DOCK_CONFIG.TRANSLATE_Y_MAX);
  });

  test("마우스가 멀리 있을 때 최소 scale과 0에 가까운 translateY가 적용된다", () => {
    const farX =
      baseRect.left + baseRect.width / 2 + DOCK_CONFIG.MOUSE_MAX_DISTANCE * 10;

    const { scale, translateY } = calculateIconStyle(farX, baseRect);

    expect(scale).toBeCloseTo(DOCK_CONFIG.SCALE_MIN);
    expect(translateY).toBeCloseTo(0);
  });

  test("마우스가 중간 거리일 때 scale과 translateY가 선형 보간된다", () => {
    const centerX = baseRect.left + baseRect.width / 2;
    const halfDistanceX = centerX + DOCK_CONFIG.MOUSE_MAX_DISTANCE / 2;

    const { scale, translateY } = calculateIconStyle(halfDistanceX, baseRect);

    const expectedT = 0.5;
    const expectedScale =
      DOCK_CONFIG.SCALE_MIN +
      expectedT * (DOCK_CONFIG.SCALE_MAX - DOCK_CONFIG.SCALE_MIN);

    const expectedTranslateY = DOCK_CONFIG.TRANSLATE_Y_MAX * expectedT;

    expect(scale).toBeCloseTo(expectedScale);
    expect(translateY).toBeCloseTo(expectedTranslateY);
  });
});

describe("getDockClasses", () => {
  test("expanded 상태에서는 넉넉한 패딩과 불쿠명도 클래스 포함", () => {
    const classes = getDockClasses("expanded");

    expect(classes).toContain("px-7");
    expect(classes).toContain("py-3");
    expect(classes).toContain("opacity-100");
    expect(classes).toContain("translate-y-0");
  });

  test("collapsed 상태에서는 작은 패딩과 반투명, hover 효과 클래스가 포함된다", () => {
    const classes = getDockClasses("collapsed");

    expect(classes).toContain("px-2");
    expect(classes).toContain("py-2");
    expect(classes).toContain("opacity-50");
    expect(classes).toContain("hover:opacity-90");
    expect(classes).toContain("cursor-pointer");
  });
});
