# 성능 최적화 가이드

이 문서는 My Trip 프로젝트의 성능 측정 및 최적화 방법을 안내합니다.

## 목표

- **Lighthouse 점수 80 이상** 달성
- **페이지 로딩 시간 3초 이내**
- **Core Web Vitals 개선**

---

## 1. Lighthouse 성능 측정

### 1.1 Chrome DevTools를 이용한 측정

가장 간단한 방법은 Chrome DevTools의 Lighthouse를 사용하는 것입니다.

**사용 방법:**
1. Chrome 브라우저에서 개발 서버 실행 (`pnpm dev`)
2. `http://localhost:3000` 접속
3. `F12` 또는 `우클릭 → 검사`로 DevTools 열기
4. **Lighthouse** 탭 선택
5. 측정할 카테고리 선택 (Performance, Accessibility, Best Practices, SEO)
6. **Analyze page load** 클릭

**권장 설정:**
- Mode: **Navigation** (페이지 로드 성능)
- Device: **Desktop** 또는 **Mobile**
- Categories: **Performance** 체크

### 1.2 Lighthouse CI 설정 (선택)

프로젝트에 Lighthouse CI를 설정하여 자동으로 성능을 측정할 수 있습니다.

**설치:**
```bash
pnpm add -D @lhci/cli
```

**설정 파일 생성** (`lighthouserc.js`):
```javascript
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000'],
      startServerCommand: 'pnpm dev',
      startServerReadyPattern: 'ready',
      startServerReadyTimeout: 30000,
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.8 }],
        'categories:seo': ['error', { minScore: 0.8 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
```

**사용 방법:**
```bash
# Lighthouse CI 실행
pnpm lighthouse-ci

# 또는 package.json에 스크립트 추가
# "lighthouse": "lhci autorun"
```

### 1.3 수동 측정 스크립트

package.json에 다음 스크립트를 추가할 수 있습니다:

```json
{
  "scripts": {
    "lighthouse": "lighthouse http://localhost:3000 --output html --output-path ./lighthouse-report.html",
    "lighthouse:mobile": "lighthouse http://localhost:3000 --output html --output-path ./lighthouse-report.html --preset mobile"
  }
}
```

---

## 2. 성능 최적화 체크리스트

### ✅ 이미 완료된 최적화

- [x] **이미지 최적화**: Next.js Image 컴포넌트 사용
- [x] **이미지 포맷 최적화**: WebP, AVIF 지원 (`next.config.ts`)
- [x] **외부 이미지 도메인 설정**: 한국관광공사 API 이미지 최적화
- [x] **에러 핸들링**: 전역 에러 경계 구현

### 🔄 추가 최적화 권장 사항

#### 2.1 이미지 최적화

- [ ] **이미지 lazy loading**: `loading="lazy"` 속성 사용 (이미 Next.js Image가 자동 처리)
- [ ] **이미지 크기 최적화**: 실제 표시 크기에 맞는 이미지 사용
- [ ] **이미지 포맷**: WebP, AVIF 우선 사용 (이미 설정됨)

#### 2.2 코드 최적화

- [ ] **Dynamic Import**: 큰 컴포넌트는 동적 import 사용
  ```typescript
  const DynamicComponent = dynamic(() => import('./HeavyComponent'), {
    loading: () => <Skeleton />,
    ssr: false, // SSR 불필요한 경우
  });
  ```
- [ ] **Tree Shaking**: 사용하지 않는 코드 제거
- [ ] **Bundle 분석**: Next.js Bundle Analyzer 사용
  ```bash
  pnpm add -D @next/bundle-analyzer
  ```

#### 2.3 캐싱 전략

- [ ] **API 응답 캐싱**: `revalidate` 옵션 사용
  ```typescript
  export const revalidate = 3600; // 1시간
  ```
- [ ] **Static Generation**: 가능한 페이지는 정적 생성
- [ ] **ISR (Incremental Static Regeneration)**: 자주 업데이트되는 페이지에 적용

#### 2.4 네트워크 최적화

- [ ] **CDN 사용**: Vercel 배포 시 자동 적용
- [ ] **HTTP/2 사용**: 서버 설정
- [ ] **압축**: Gzip/Brotli 압축 (Vercel 자동 적용)

#### 2.5 폰트 최적화

- [ ] **폰트 최적화**: `next/font` 사용 (이미 적용됨)
- [ ] **폰트 preload**: 중요한 폰트는 preload
- [ ] **폰트 subset**: 필요한 문자만 포함

#### 2.6 CSS 최적화

- [ ] **Critical CSS**: 첫 화면에 필요한 CSS만 인라인
- [ ] **CSS 최소화**: Tailwind CSS 사용 (자동 처리)
- [ ] **불필요한 CSS 제거**: PurgeCSS 사용 (Tailwind 자동 처리)

---

## 3. Core Web Vitals 목표

### 3.1 LCP (Largest Contentful Paint)

**목표: < 2.5초**

**개선 방법:**
- 이미지 최적화 (이미 적용)
- 서버 응답 시간 개선
- 중요 리소스 preload

### 3.2 FID (First Input Delay) / INP (Interaction to Next Paint)

**목표: < 100ms**

**개선 방법:**
- JavaScript 최소화
- 긴 작업 분할 (code splitting)
- 이벤트 핸들러 최적화

### 3.3 CLS (Cumulative Layout Shift)

**목표: < 0.1**

**개선 방법:**
- 이미지 크기 명시 (width, height)
- 폰트 로딩 최적화
- 동적 콘텐츠 크기 예약

---

## 4. 성능 측정 도구

### 4.1 Chrome DevTools

- **Performance 탭**: 런타임 성능 분석
- **Network 탭**: 네트워크 요청 분석
- **Memory 탭**: 메모리 사용량 분석

### 4.2 WebPageTest

- URL: https://www.webpagetest.org/
- 전세계 여러 위치에서 측정 가능
- 상세한 워터폴 분석 제공

### 4.3 Next.js Analytics

Vercel 배포 시 Next.js Analytics를 사용할 수 있습니다:

```bash
pnpm add @vercel/analytics
```

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

---

## 5. 성능 모니터링

### 5.1 실시간 모니터링

- **Vercel Analytics**: Vercel 배포 시 자동 제공
- **Google Analytics**: Core Web Vitals 리포트
- **Sentry Performance**: 에러 및 성능 모니터링

### 5.2 정기적인 측정

- **주 1회**: Lighthouse 점수 확인
- **배포 후**: 성능 회귀 확인
- **월 1회**: 전체 성능 리뷰

---

## 6. 성능 개선 우선순위

1. **높은 우선순위**
   - 이미지 최적화 ✅ (완료)
   - 번들 크기 최적화
   - API 응답 시간 개선

2. **중간 우선순위**
   - 코드 스플리팅
   - 캐싱 전략 개선
   - 폰트 최적화

3. **낮은 우선순위**
   - CSS 최적화
   - 서드파티 스크립트 최적화
   - 고급 캐싱 전략

---

## 7. 참고 자료

- [Next.js 성능 최적화](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse 점수 개선](https://web.dev/performance-scoring/)
- [Core Web Vitals](https://web.dev/core-web-vitals/)

---

## 8. 체크리스트

배포 전 확인 사항:

- [ ] Lighthouse Performance 점수 80 이상
- [ ] LCP < 2.5초
- [ ] FID/INP < 100ms
- [ ] CLS < 0.1
- [ ] 번들 크기 확인
- [ ] 이미지 최적화 확인
- [ ] 에러 없는지 확인

---

**마지막 업데이트**: 2025년 1월

