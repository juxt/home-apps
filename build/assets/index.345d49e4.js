var Gt = Object.defineProperty,
  Xt = Object.defineProperties;
var Yt = Object.getOwnPropertyDescriptors;
var ge = Object.getOwnPropertySymbols;
var Ke = Object.prototype.hasOwnProperty,
  _e = Object.prototype.propertyIsEnumerable;
var je = (e, r, a) =>
    r in e
      ? Gt(e, r, { enumerable: !0, configurable: !0, writable: !0, value: a })
      : (e[r] = a),
  h = (e, r) => {
    for (var a in r || (r = {})) Ke.call(r, a) && je(e, a, r[a]);
    if (ge) for (var a of ge(r)) _e.call(r, a) && je(e, a, r[a]);
    return e;
  },
  y = (e, r) => Xt(e, Yt(r));
var te = (e, r) => {
  var a = {};
  for (var o in e) Ke.call(e, o) && r.indexOf(o) < 0 && (a[o] = e[o]);
  if (e != null && ge)
    for (var o of ge(e)) r.indexOf(o) < 0 && _e.call(e, o) && (a[o] = e[o]);
  return a;
};
var xe = (e, r, a) => (je(e, typeof r != 'symbol' ? r + '' : r, a), a);
import {
  r as D,
  j as t,
  F as J,
  u as ve,
  a as z,
  R as Zt,
  t as Q,
  b as H,
  c as ee,
  d,
  S as st,
  e as er,
  f as T,
  C as it,
  g as Qe,
  P as Je,
  h as tr,
  M as q,
  i as lt,
  T as ue,
  E as rr,
  k as ar,
  V as or,
  l as nr,
  D as sr,
  s as ir,
  m as $,
  O as lr,
  N as dr,
  n as cr,
  o as mr,
  p as ur,
  q as pr,
  v as hr,
  H as fr,
  L as gr,
  w as xr,
  x as br,
  y as yr,
  z as vr,
  A as wr,
  B as Nr,
  G as ke,
  I as le,
  J as ce,
  K as Cr,
  Q as Ge,
  U as Xe,
  W as G,
  X as re,
  Y as me,
  Z as jr,
  _ as Sr,
  $ as Ir,
  a0 as kr,
  a1 as dt,
  a2 as Se,
  a3 as Dr,
  a4 as ct,
  a5 as mt,
  a6 as ut,
  a7 as pt,
  a8 as ne,
  a9 as Pr,
  aa as Ye,
  ab as Mr,
  ac as Rr,
  ad as ht,
  ae as ft,
  af as Fr,
  ag as Tr,
  ah as Ar,
  ai as Hr,
  aj as Wr,
  ak as $r,
  al as Br,
  am as Er,
  an as Or,
  ao as Lr,
  ap as Vr,
} from './vendor.0c096ca8.js';
const qr = function () {
  const r = document.createElement('link').relList;
  if (r && r.supports && r.supports('modulepreload')) return;
  for (const n of document.querySelectorAll('link[rel="modulepreload"]')) o(n);
  new MutationObserver((n) => {
    for (const i of n)
      if (i.type === 'childList')
        for (const c of i.addedNodes)
          c.tagName === 'LINK' && c.rel === 'modulepreload' && o(c);
  }).observe(document, { childList: !0, subtree: !0 });
  function a(n) {
    const i = {};
    return (
      n.integrity && (i.integrity = n.integrity),
      n.referrerpolicy && (i.referrerPolicy = n.referrerpolicy),
      n.crossorigin === 'use-credentials'
        ? (i.credentials = 'include')
        : n.crossorigin === 'anonymous'
        ? (i.credentials = 'omit')
        : (i.credentials = 'same-origin'),
      i
    );
  }
  function o(n) {
    if (n.ep) return;
    n.ep = !0;
    const i = a(n);
    fetch(n.href, i);
  }
};
qr();
let se;
const Ur = (e) => e / (1 + Math.abs(e)),
  Ze = { transform: null, prevX: 0, rotation: 0 };
class gt extends D.exports.Component {
  constructor() {
    super(...arguments);
    xe(this, 'state', h({}, Ze));
    xe(this, 'patchTransform', () => {
      const {
        snapshot: { isDragging: r },
        style: a,
        animationRotationFade: o,
        rotationMultiplier: n,
        sigmoidFunction: i,
      } = this.props;
      if (r && a.transform) {
        const c = a.transform
            .match(/translate\(.{1,}\)/g)[0]
            .match(/-?[0-9]{1,}/g)[0],
          m = c - this.state.prevX;
        let l = this.state.rotation * o + i(m) * n;
        const u = `${a.transform} rotate(${l}deg)`;
        Math.abs(l) < 0.01 && (l = 0),
          this.setState({ transform: u, prevX: c, rotation: l }, () => {
            se = requestAnimationFrame(this.patchTransform);
          });
      } else se = requestAnimationFrame(this.patchTransform);
    });
  }
  static getDerivedStateFromProps(r, a) {
    return r.snapshot.dropAnimation && a.transform ? h({}, Ze) : null;
  }
  componentDidMount() {
    this.props.snapshot.isDragging &&
      (se = requestAnimationFrame(this.patchTransform));
  }
  componentDidUpdate(r) {
    !r.snapshot.isDragging &&
      this.props.snapshot.isDragging &&
      (se = requestAnimationFrame(this.patchTransform)),
      r.snapshot.isDragging &&
        !this.props.snapshot.isDragging &&
        cancelAnimationFrame(se);
  }
  componentWillUnmount() {
    cancelAnimationFrame(se);
  }
  render() {
    const {
        snapshot: { isDragging: r, dropAnimation: a },
      } = this.props,
      o =
        r && !a
          ? y(h({}, this.props.style), { transform: this.state.transform })
          : this.props.style;
    return t(J, { children: this.props.children(o) });
  }
}
xe(gt, 'defaultProps', {
  animationRotationFade: 0.9,
  rotationMultiplier: 1.3,
  sigmoidFunction: Ur,
});
function P(e, r) {
  return async () => {
    const o = await (
      await fetch('https://alexd.uk/site/kanbantest/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ query: e, variables: r }),
      })
    ).json();
    if (o.errors) {
      const { message: n } = o.errors[0];
      throw new Error(n);
    }
    return o.data;
  };
}
var ye = ((e) => (
  (e.Done = 'DONE'), (e.Started = 'STARTED'), (e.Unstarted = 'UNSTARTED'), e
))(ye || {});
const zr = `
    fragment ProjectFields on Project {
  id
  name
  description
}
    `,
  Kr = `
    fragment CardFields on Card {
  ... on HiringCard {
    id
    title
    _siteValidTime
    project {
      id
      name
    }
  }
}
    `,
  _r = `
    fragment WorkflowStateFields on WorkflowState {
  id
  name
  description
  workflow {
    name
  }
  cards {
    ...CardFields
  }
}
    ${Kr}`,
  Me = `
    query cardHistory($id: ID!) {
  cardHistory(id: $id, limit: 100) {
    ... on HiringCard {
      id
      title
      description
      files {
        name
      }
      cvPdf {
        name
      }
      _siteValidTime
      _siteSubject
      workflowState {
        name
      }
      project {
        name
      }
    }
  }
}
    `,
  pe = (e, r) => ve(['cardHistory', e], P(Me, e), r);
pe.document = Me;
pe.getKey = (e) => ['cardHistory', e];
pe.fetcher = (e) => P(Me, e);
const Re = `
    query cardByIds($ids: [ID]!) {
  cardsByIds(ids: $ids) {
    ... on HiringCard {
      id
      description
      _siteValidTime
      _siteSubject
      cvPdf {
        base64
        name
        type
      }
      files {
        base64
        name
        type
      }
      project {
        description
        id
        name
      }
      title
      workflowState {
        id
        name
      }
    }
  }
}
    `,
  _ = (e, r) => ve(['cardByIds', e], P(Re, e), r);
_.document = Re;
_.getKey = (e) => ['cardByIds', e];
_.fetcher = (e) => P(Re, e);
const Fe = `
    query commentsForCard($id: ID!) {
  commentsForCard(id: $id) {
    id
    _siteSubject
    _siteValidTime
    text
    parentId
    children {
      text
    }
  }
}
    `,
  he = (e, r) => ve(['commentsForCard', e], P(Fe, e), r);
he.document = Fe;
he.getKey = (e) => ['commentsForCard', e];
he.fetcher = (e) => P(Fe, e);
const xt = `
    mutation createHiringCard($card: HiringCardInput!, $cardId: ID!, $cardIds: [ID!]!, $workflowStateId: ID!) {
  updateHiringCard(id: $cardId, Card: $card) {
    id
  }
  updateWorkflowState(id: $workflowStateId, cardIds: $cardIds) {
    id
  }
}
    `,
  bt = (e) => z(['createHiringCard'], (r) => P(xt, r)(), e);
bt.fetcher = (e) => P(xt, e);
const yt = `
    mutation createComment($Comment: CommentInput!) {
  createComment(Comment: $Comment) {
    id
  }
}
    `,
  vt = (e) => z(['createComment'], (r) => P(yt, r)(), e);
vt.fetcher = (e) => P(yt, e);
const wt = `
    mutation createProject($project: ProjectInput!, $projectId: ID!) {
  createProject(project: $project) {
    id
  }
}
    `,
  Nt = (e) => z(['createProject'], (r) => P(wt, r)(), e);
Nt.fetcher = (e) => P(wt, e);
const Ct = `
    mutation createWorkflowState($colId: ID!, $workflowStateIds: [ID!]!, $workflowId: ID!, $workflowStateName: String!, $description: String) {
  updateWorkflowState(
    id: $colId
    name: $workflowStateName
    description: $description
  ) {
    id
  }
  updateWorkflow(id: $workflowId, workflowStateIds: $workflowStateIds) {
    id
  }
}
    `,
  jt = (e) => z(['createWorkflowState'], (r) => P(Ct, r)(), e);
jt.fetcher = (e) => P(Ct, e);
const St = `
    mutation deleteComment($commentId: ID!) {
  deleteComment(id: $commentId) {
    id
  }
}
    `,
  It = (e) => z(['deleteComment'], (r) => P(St, r)(), e);
It.fetcher = (e) => P(St, e);
const Te = `
    query kanbanData {
  allWorkflows {
    name
    description
    id
    workflowStates {
      ...WorkflowStateFields
    }
  }
  allWorkflowStates {
    id
    name
    description
    cards {
      ... on HiringCard {
        id
      }
    }
  }
  allHiringCards {
    id
    _siteValidTime
  }
  allProjects {
    ...ProjectFields
  }
}
    ${_r}
${zr}`,
  K = (e, r) =>
    ve(e === void 0 ? ['kanbanData'] : ['kanbanData', e], P(Te, e), r);
K.document = Te;
K.getKey = (e) => (e === void 0 ? ['kanbanData'] : ['kanbanData', e]);
K.fetcher = (e) => P(Te, e);
const kt = `
    mutation moveCard($workflowStateId: ID!, $cardId: ID!, $previousCard: ID) {
  moveCard(
    cardId: $cardId
    workflowStateId: $workflowStateId
    previousCard: $previousCard
  ) {
    ... on HiringCard {
      id
    }
  }
}
    `,
  Ae = (e) => z(['moveCard'], (r) => P(kt, r)(), e);
Ae.fetcher = (e) => P(kt, e);
const Dt = `
    mutation rollbackCard($asOf: String!, $id: ID!) {
  rollbackCard(asOf: $asOf, id: $id) {
    ... on HiringCard {
      id
    }
  }
}
    `,
  Pt = (e) => z(['rollbackCard'], (r) => P(Dt, r)(), e);
Pt.fetcher = (e) => P(Dt, e);
const Mt = `
    mutation updateHiringCard($card: HiringCardInput!, $cardId: ID!) {
  updateHiringCard(id: $cardId, Card: $card) {
    id
  }
}
    `,
  Rt = (e) => z(['updateHiringCard'], (r) => P(Mt, r)(), e);
Rt.fetcher = (e) => P(Mt, e);
const Ft = `
    mutation updateCardPosition($workflowStateId: ID!, $cardIds: [ID!]!) {
  updateWorkflowState(id: $workflowStateId, cardIds: $cardIds) {
    id
  }
}
    `,
  Tt = (e) => z(['updateCardPosition'], (r) => P(Ft, r)(), e);
Tt.fetcher = (e) => P(Ft, e);
const At = `
    mutation updateProject($project: ProjectInput!, $projectId: ID!) {
  updateProject(id: $projectId, project: $project) {
    id
  }
}
    `,
  Ht = (e) => z(['updateProject'], (r) => P(At, r)(), e);
Ht.fetcher = (e) => P(At, e);
const Wt = `
    mutation updateWorkflowState($colId: ID!, $name: String!, $description: String) {
  updateWorkflowState(id: $colId, name: $name, description: $description) {
    id
  }
}
    `,
  $t = (e) => z(['updateWorkflowState'], (r) => P(Wt, r)(), e);
$t.fetcher = (e) => P(Wt, e);
function M(e) {
  return e != null;
}
function Qr(e, r, a) {
  return e.reduce(
    (o, n, i, c) => (
      r === a && o.push(n),
      i === r ||
        (r < a && o.push(n), i === a && o.push(c[r]), r > a && o.push(n)),
      o
    ),
    [],
  );
}
function Jr(e, r, a) {
  const o = [...e];
  return o.splice(a, 0, r), o;
}
function Gr(e, r) {
  return e.reduce((a, o, n) => (n === r ? a : [...a, o]), []);
}
function Ie(e, r) {
  return (e == null ? void 0 : e.cards)
    ? y(h({}, e), { cards: r(e.cards.filter(M)) })
    : e;
}
function et(e, { index: r, droppableId: a }, { index: o, droppableId: n }) {
  if (!e) return null;
  const i = e.workflowStates.filter(M).map((g) => {
      var v, p;
      return y(h({}, g), {
        cards:
          (p = (v = g.cards) == null ? void 0 : v.filter(M)) != null ? p : [],
      });
    }),
    c = i.find((g) => g.id === a),
    m = i.find((g) => g.id === n);
  if (!c || !m) return e;
  const s = (g) => y(h({}, e), { workflowStates: i.map(g) });
  if (c.id === m.id) {
    const g = Ie(c, (v) => Qr(v, r, o));
    return s((v) => (v.id === c.id ? g : v));
  }
  const l = Ie(c, (g) => Gr(g, r)),
    u = Ie(m, (g) => Jr(g, c.cards[r], o));
  return s((g) => (g.id === c.id ? l : g.id === m.id ? u : g));
}
const Z = (e) => ({
  onSettled: () => {
    e.refetchQueries(K.getKey());
  },
});
function Xr(e) {
  return new Promise((r) => {
    Zt.imageFileResizer(
      e,
      200,
      200,
      'JPEG',
      60,
      0,
      (a) => {
        r(a.toString());
      },
      'base64',
    );
  });
}
function tt(e) {
  return e.type.startsWith('image/')
    ? Xr(e)
    : new Promise((r, a) => {
        const o = new FileReader();
        o.readAsDataURL(e),
          (o.onload = () => {
            var n, i;
            r(
              (i = (n = o.result) == null ? void 0 : n.toString()) != null
                ? i
                : '',
            );
          }),
          (o.onerror = () => {
            Q.error('Error reading file'), a(o.error);
          });
      });
}
const Yr = (e) => {
  const r = atob(e);
  let { length: a } = r;
  const o = new Uint8Array(a);
  for (; a--; ) o[a] = r.charCodeAt(a);
  return new Blob([o], { type: 'application/pdf' });
};
function U(e) {
  const c = H(),
    { modalState: r } = c,
    a = te(c, ['modalState']),
    o = ee();
  return [
    (r == null ? void 0 : r.formModalType) === e.formModalType,
    (m) => {
      o(
        m
          ? { replace: !0, search: y(h({}, a), { modalState: h(h({}, r), e) }) }
          : { replace: !0, search: h({}, a) },
      );
    },
  ];
}
function Zr(e) {
  const r = () => Boolean(e.match(/Android/i)),
    a = () => Boolean(e.match(/iPhone|iPad|iPod/i)),
    o = () => Boolean(e.match(/Opera Mini/i)),
    n = () => Boolean(e.match(/IEMobile/i)),
    i = () => Boolean(e.match(/SSR/i)),
    c = () => Boolean(r() || a() || o() || n());
  return {
    isMobile: c,
    isDesktop: () => Boolean(!c() && !i()),
    isAndroid: r,
    isIos: a,
    isSSR: i,
  };
}
function Bt() {
  const e = typeof navigator == 'undefined' ? 'SSR' : navigator.userAgent;
  return Zr(e);
}
function He() {
  const { modalState: e } = H(),
    r = (e == null ? void 0 : e.workflowId) || '';
  return K(void 0, {
    enabled: r !== '',
    select: (o) => {
      var n, i;
      return (i =
        (n = o == null ? void 0 : o.allWorkflows) == null
          ? void 0
          : n.find((c) => (c == null ? void 0 : c.id) === r)) == null
        ? void 0
        : i.workflowStates.filter(M);
    },
  });
}
function ea(e) {
  return K(void 0, {
    select: (a) => {
      var o;
      return (o = a == null ? void 0 : a.allWorkflowStates) == null
        ? void 0
        : o.filter(M).find((n) => n.id === e);
    },
  });
}
function Et() {
  var r, a;
  const e = K(void 0, {
    select: (o) => {
      var n;
      return (n = o == null ? void 0 : o.allProjects) == null
        ? void 0
        : n.filter(M);
    },
  });
  return (a =
    (r = e == null ? void 0 : e.data) == null
      ? void 0
      : r.map((o) => ({ label: o.name, value: o.id }))) != null
    ? a
    : [];
}
function Ot() {
  const e = H().workflowProjectId;
  return K(void 0, {
    select: (a) => {
      var o;
      return (o = a == null ? void 0 : a.allProjects) == null
        ? void 0
        : o.filter(M).find((n) => n.id === e);
    },
  });
}
function We(e, r) {
  var o, n;
  const a = _(
    { ids: [e || ''] },
    y(h({}, r), {
      select: (i) => {
        var c;
        return y(h({}, i), {
          cardsByIds:
            (c = i == null ? void 0 : i.cardsByIds) == null
              ? void 0
              : c.filter(M),
        });
      },
      enabled: !!e,
      staleTime: 5e3,
    }),
  );
  return y(h({}, a), {
    card:
      (n = (o = a.data) == null ? void 0 : o.cardsByIds) == null
        ? void 0
        : n[0],
  });
}
function ta(e) {
  return he(
    { id: e },
    {
      select: (a) => {
        var o;
        return (o = a == null ? void 0 : a.commentsForCard) == null
          ? void 0
          : o.filter(M).filter((n) => !(n == null ? void 0 : n.parentId));
      },
    },
  );
}
function ra(e, r) {
  var o;
  const a = pe(
    { id: e || '' },
    y(h({}, r), {
      select: (n) => {
        var i;
        return y(h({}, n), {
          ca:
            (i = n == null ? void 0 : n.cardHistory) == null
              ? void 0
              : i.filter((c) => (c == null ? void 0 : c._siteValidTime)),
        });
      },
      enabled: !!e,
      staleTime: 5e3,
    }),
  );
  return y(h({}, a), { history: (o = a.data) == null ? void 0 : o.ca });
}
function aa({ tabs: e, navName: r }) {
  const a = e.map((s) => ({ value: s.id, label: s.name })),
    o = ee(),
    n = H(),
    i = n[r],
    c = a.find((s) => s.value === i),
    m = (s) => {
      o({ to: '.', search: y(h({}, n), { [r]: s }) });
    };
  return d('div', {
    className: 'mb-2',
    children: [
      d('div', {
        className: 'sm:hidden',
        children: [
          t('label', {
            htmlFor: 'tabs',
            className: 'sr-only',
            children: 'Select a tab',
          }),
          t(st, {
            className:
              'block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md',
            id: 'tabs',
            name: 'tabs',
            value: c,
            onChange: (s) => s && m(s.value),
            placeholder: 'Select a Project',
            options: a,
          }),
        ],
      }),
      t('div', {
        className: 'hidden sm:block',
        children: t('div', {
          className: 'border-b border-gray-200',
          children: d('nav', {
            className: '-mb-px flex space-x-8 justify-between',
            'aria-label': 'Tabs',
            children: [
              t('div', {
                className:
                  'flex items-center justify-center px-2  lg:justify-start',
                children: d('div', {
                  className: 'max-w-lg lg:max-w-xs',
                  children: [
                    t('label', {
                      htmlFor: 'search',
                      className: 'sr-only',
                      children: 'Search',
                    }),
                    d('div', {
                      className: 'relative',
                      children: [
                        t('div', {
                          className:
                            'absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none',
                          children: t(er, {
                            className: 'h-5 w-5 text-gray-400',
                            'aria-hidden': 'true',
                          }),
                        }),
                        t('input', {
                          id: 'search',
                          name: 'search',
                          className:
                            'block pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm',
                          placeholder: 'Search',
                          type: 'search',
                        }),
                      ],
                    }),
                  ],
                }),
              }),
              t('div', {
                className: 'flex flex-row',
                children: e.map((s) => {
                  const l = s.id === i;
                  return d(
                    'button',
                    {
                      type: 'button',
                      onClick: () => m(s.id),
                      className: T(
                        l
                          ? 'border-indigo-500 text-indigo-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200',
                        'whitespace-nowrap cursor-pointer flex py-4 px-1 border-b-2 font-medium text-sm',
                      ),
                      'aria-current': l ? 'page' : void 0,
                      children: [
                        s.name,
                        typeof s.count == 'number'
                          ? t('span', {
                              className: T(
                                l
                                  ? 'bg-indigo-100 text-indigo-600'
                                  : 'bg-gray-100 text-gray-900',
                                'hidden ml-3 py-0.5 px-2.5 rounded-full text-xs font-medium md:inline-block',
                              ),
                              children: s.count,
                            })
                          : null,
                      ],
                    },
                    s.id + s.name,
                  );
                }),
              }),
              t('div', { className: 'hidden lg:block lg:w-60' }),
            ],
          }),
        }),
      }),
    ],
  });
}
function oa({ tabs: e, navName: r }) {
  const a = ee(),
    o = H(),
    n = o[r],
    i = (c) => {
      a({ to: '.', search: y(h({}, o), { [r]: c }) });
    };
  return t('div', {
    className: 'border-b border-gray-200',
    children: t('nav', {
      className: '-mb-px flex space-x-8 justify-center',
      'aria-label': 'Tabs',
      children: e
        .filter((c) => !c.hidden)
        .map((c) => {
          const m = c.id === n || c.default;
          return t(
            'button',
            {
              type: 'button',
              onClick: () => i(c.id),
              className: T(
                m
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200',
                'whitespace-nowrap cursor-pointer flex py-4 px-1 border-b-2 font-medium text-sm',
              ),
              'aria-current': m ? 'page' : void 0,
              children: c.name,
            },
            c.id + c.name,
          );
        }),
    }),
  });
}
function na({ workflow: e, handleAddCard: r }) {
  const a = Ot().data,
    o = Bt().isMobile(),
    n = ee(),
    i = H(),
    { showDetails: c } = i,
    m = c ? 'Hide details' : 'Show details',
    s = c
      ? t(rr, {
          className: '-ml-1 mr-2 h-5 w-5 text-gray-500',
          'aria-hidden': 'true',
        })
      : t(ar, {
          className: '-ml-1 mr-2 h-5 w-5 text-gray-500',
          'aria-hidden': 'true',
        }),
    l = () => {
      n({ search: y(h({}, i), { showDetails: !c }) });
    },
    u = !(i == null ? void 0 : i.view) || i.view === 'card',
    g = u
      ? t(or, {
          className: '-ml-1 mr-2 h-5 w-5 text-gray-500',
          'aria-hidden': 'true',
        })
      : t(nr, {
          className: '-ml-1 mr-2 h-5 w-5 text-gray-500',
          'aria-hidden': 'true',
        }),
    v = u ? 'Table View' : 'Card View',
    p = () => {
      n({ search: y(h({}, i), { view: u ? 'table' : 'card' }) });
    },
    f = a == null ? void 0 : a.name,
    x = `Edit "${a == null ? void 0 : a.name}"`,
    N = 'Add Project',
    [, C] = U({
      formModalType: 'editProject',
      projectId: a == null ? void 0 : a.id,
    }),
    [, I] = U({ formModalType: 'addProject' });
  return t(J, {
    children: d('div', {
      className: 'lg:flex lg:items-center lg:justify-between z-20',
      children: [
        d('div', {
          className: 'flex-1 min-w-0',
          children: [
            t('nav', {
              className: 'flex',
              'aria-label': 'Breadcrumb',
              children: d('ol', {
                className: 'flex items-center space-x-4',
                children: [
                  t('li', {
                    children: t('div', {
                      className: 'flex',
                      children: t('span', {
                        className:
                          'text-sm font-medium text-gray-500 hover:text-gray-700',
                        children: 'Projects',
                      }),
                    }),
                  }),
                  t('li', {
                    children: d('div', {
                      className: 'flex items-center',
                      children: [
                        t(it, {
                          className: 'flex-shrink-0 h-5 w-5 text-gray-400',
                          'aria-hidden': 'true',
                        }),
                        t('span', {
                          className:
                            'ml-4 text-sm font-medium text-gray-500 hover:text-gray-700',
                          children:
                            (a == null ? void 0 : a.name) || 'All projects',
                        }),
                      ],
                    }),
                  }),
                ],
              }),
            }),
            t('h2', {
              className:
                'capitalize mt-2 text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate',
              children: e == null ? void 0 : e.name,
            }),
            (e == null ? void 0 : e.description) &&
              t('div', {
                className:
                  'mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6',
                children: t('div', {
                  className: 'mt-2 flex items-center text-sm text-gray-500',
                  children: e.description,
                }),
              }),
          ],
        }),
        d('div', {
          className: 'mt-5 flex lg:mt-0 lg:ml-4',
          children: [
            t('span', {
              className: 'hidden sm:block',
              children: d('button', {
                type: 'button',
                onClick: () => I(!0),
                className:
                  'inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
                children: [
                  t(Qe, {
                    className: '-ml-1 mr-2 h-5 w-5 text-gray-500',
                    'aria-hidden': 'true',
                  }),
                  N,
                ],
              }),
            }),
            f &&
              t('span', {
                className: 'hidden sm:block ml-3',
                children: d('button', {
                  type: 'button',
                  onClick: () => C(!0),
                  className:
                    'inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
                  children: [
                    t(Je, {
                      className: '-ml-1 mr-2 h-5 w-5 text-gray-500',
                      'aria-hidden': 'true',
                    }),
                    x,
                  ],
                }),
              }),
            u &&
              t('span', {
                className: 'hidden sm:block ml-3',
                children: d('button', {
                  type: 'button',
                  onClick: l,
                  className:
                    'inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
                  children: [s, m],
                }),
              }),
            t('span', {
              className: 'hidden sm:block ml-3',
              children: d('button', {
                type: 'button',
                onClick: p,
                className:
                  'inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
                children: [g, v],
              }),
            }),
            t('span', {
              className: 'sm:ml-3',
              children: d('button', {
                type: 'button',
                className:
                  'inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
                onClick: r,
                children: [
                  t(tr, {
                    className: '-ml-1 mr-2 h-5 w-5',
                    'aria-hidden': 'true',
                  }),
                  'Add Card',
                  !o && ' (c)',
                ],
              }),
            }),
            d(q, {
              as: 'span',
              className: 'ml-3 relative sm:hidden',
              children: [
                d(q.Button, {
                  className:
                    'inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
                  children: [
                    'More',
                    t(lt, {
                      className: '-mr-1 ml-2 h-5 w-5 text-gray-500',
                      'aria-hidden': 'true',
                    }),
                  ],
                }),
                t(ue, {
                  as: D.exports.Fragment,
                  enter: 'transition ease-out duration-200',
                  enterFrom: 'transform opacity-0 scale-95',
                  enterTo: 'transform opacity-100 scale-100',
                  leave: 'transition ease-in duration-75',
                  leaveFrom: 'transform opacity-100 scale-100',
                  leaveTo: 'transform opacity-0 scale-95',
                  children: d(q.Items, {
                    className:
                      'origin-top-right z-20 absolute cursor-pointer right-0 mt-2 -mr-1 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none',
                    children: [
                      t(q.Item, {
                        children: ({ active: j }) =>
                          d('button', {
                            type: 'button',
                            onClick: () => I(!0),
                            className: T(
                              j ? 'bg-gray-100' : '',
                              'flex px-4 py-2 text-sm text-gray-700',
                            ),
                            children: [
                              t(Qe, {
                                className: '-ml-1 mr-2 h-5 w-5 text-gray-500',
                                'aria-hidden': 'true',
                              }),
                              N,
                            ],
                          }),
                      }),
                      f &&
                        t(q.Item, {
                          children: ({ active: j }) =>
                            d('button', {
                              type: 'button',
                              onClick: () => C(!0),
                              className: T(
                                j ? 'bg-gray-100' : '',
                                'flex px-4 py-2 text-sm text-gray-700',
                              ),
                              children: [
                                t(Je, {
                                  className: '-ml-1 mr-2 h-5 w-5 text-gray-500',
                                  'aria-hidden': 'true',
                                }),
                                x,
                              ],
                            }),
                        }),
                      u &&
                        t(q.Item, {
                          children: ({ active: j }) =>
                            d('button', {
                              type: 'button',
                              onClick: l,
                              className: T(
                                j ? 'bg-gray-100' : '',
                                'flex px-4 py-2 text-sm text-gray-700',
                              ),
                              children: [s, m],
                            }),
                        }),
                      t(q.Item, {
                        children: ({ active: j }) =>
                          d('button', {
                            type: 'button',
                            onClick: p,
                            className: T(
                              j ? 'bg-gray-100' : '',
                              'flex px-4 py-2 text-sm text-gray-700',
                            ),
                            children: [g, v],
                          }),
                      }),
                    ],
                  }),
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  });
}
function $e({ options: e }) {
  return d(q, {
    as: 'div',
    className: 'relative flex-shrink-0 pr-2',
    children: [
      d(q.Button, {
        className:
          'w-8 h-8 bg-white inline-flex items-center justify-center text-gray-400 rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500',
        children: [
          t('span', { className: 'sr-only', children: 'Open options' }),
          t(sr, { className: 'w-5 h-5', 'aria-hidden': 'true' }),
        ],
      }),
      t(ue, {
        as: D.exports.Fragment,
        enter: 'transition ease-out duration-100',
        enterFrom: 'transform opacity-0 scale-95',
        enterTo: 'transform opacity-100 scale-100',
        leave: 'transition ease-in duration-75',
        leaveFrom: 'transform opacity-100 scale-100',
        leaveTo: 'transform opacity-0 scale-95',
        children: t(q.Items, {
          className:
            'z-10 mx-3 origin-top-right absolute right-10 top-3 w-48 mt-1 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-200 focus:outline-none',
          children: e.map(
            ({ label: r, props: a, id: o, Icon: n, ActiveIcon: i }) =>
              t(
                'div',
                {
                  className: 'py-1 cursor-pointer',
                  children: t(q.Item, {
                    children: ({ active: c }) =>
                      d(
                        'button',
                        y(
                          h(
                            {
                              className: `${
                                c ? 'bg-violet-500 text-white' : 'text-gray-900'
                              } group flex rounded-md items-center w-full px-2 py-2 text-sm`,
                            },
                            a,
                          ),
                          {
                            type: 'button',
                            children: [
                              c &&
                                t(i, {
                                  className: 'w-5 h-5 text-violet-300 mr-2',
                                  'aria-hidden': !0,
                                }),
                              !c &&
                                t(n, {
                                  className: 'w-5 h-5 text-violet-500 mr-2',
                                  'aria-hidden': !0,
                                }),
                              r,
                            ],
                          },
                        ),
                      ),
                  }),
                },
                o,
              ),
          ),
        }),
      }),
    ],
  });
}
const sa = ir([
  {
    id: 'https://home.juxt.site/home/people/011e4ca4-cc5d-4c04-908f-044de6532fff',
    name: 'Anders Pyfl',
    staffRecord: { juxtcode: 'arp' },
  },
  {
    id: 'https://home.juxt.site/home/people/b4914777-51b7-4f89-ab12-0f0141fafa42',
    name: 'Will Cole-Jordan',
    staffRecord: { juxtcode: 'wcj' },
  },
  {
    id: 'https://home.juxt.site/home/people/08534d9a-264a-47e1-b1ac-d2359e872627',
    name: 'Fraser Crossman',
    staffRecord: { juxtcode: 'fwc' },
  },
  {
    id: 'https://home.juxt.site/home/people/5f561131-acc7-4264-a8c2-7b4eb2c29285',
    name: "Connor O'Rourke",
    staffRecord: { juxtcode: 'cor' },
  },
  {
    id: 'https://home.juxt.site/home/people/5f195837-e901-4d26-9e02-e0db6d2a1926',
    name: 'Steve Harris',
    staffRecord: { juxtcode: 'sdh' },
  },
  {
    id: 'https://home.juxt.site/home/people/61938ade-b657-427a-af9e-9e7df1b1820f',
    name: 'Tara El Kashef',
    staffRecord: { juxtcode: 'tek' },
  },
  {
    id: 'https://home.juxt.site/home/people/1d0d424b-1e94-4878-9be2-d64c44f818c5',
    name: 'Dominic Monroe',
    staffRecord: { juxtcode: 'dmc' },
  },
  {
    id: 'https://home.juxt.site/home/people/7f8503eb-ba07-4939-8e39-8b53a581d845',
    name: 'Matthew Butler-Williams',
    staffRecord: { juxtcode: 'mat' },
  },
  {
    id: 'https://home.juxt.site/home/people/6036b355-566d-4e24-b5e4-a1c11d8e3a6b',
    name: 'Kathryn McAllister',
    staffRecord: { juxtcode: 'kat' },
  },
  {
    id: 'https://home.juxt.site/home/people/7eab8dc0-8aba-4e85-bf8d-98ea7c1666ef',
    name: 'Marco Furone',
    staffRecord: { juxtcode: 'mar' },
  },
  {
    id: 'https://home.juxt.site/home/people/5b310cf8-d56b-42bc-af89-d0f08f40001b',
    name: 'Johanna Antonelli',
    staffRecord: { juxtcode: 'joa' },
  },
  {
    id: 'https://home.juxt.site/home/people/1fd97c8d-c37c-4d14-ae48-0f45b94672f4',
    name: 'Mark Woodhall',
    staffRecord: { juxtcode: 'mrk' },
  },
  {
    id: 'https://home.juxt.site/home/people/5cdbef2c-15c5-46f3-827d-42cfb71c9754',
    name: 'Zyxmn Daley Jes',
    staffRecord: { juxtcode: 'zyx' },
  },
  {
    id: 'https://home.juxt.site/home/people/5d4809d9-2399-4da3-8168-f339aa2b0924',
    name: 'Daniel Mason',
    staffRecord: { juxtcode: 'dan' },
  },
  {
    id: 'https://home.juxt.site/home/people/60014770-b714-4b5c-bc01-d727d36b6d9f',
    name: 'Tim Greene',
    staffRecord: { juxtcode: 'tim' },
  },
  {
    id: 'https://home.juxt.site/home/people/c80c9a1d-ce0a-4f02-8e9e-31abb80d2e9f',
    name: 'Yufei Xie',
    staffRecord: { juxtcode: 'yfx' },
  },
  {
    id: 'https://home.juxt.site/home/people/c36010fc-2d1f-416b-9b91-3dfb9c1a4fce',
    name: 'Kath Read',
    staffRecord: { juxtcode: 'kth' },
  },
  {
    id: 'https://home.juxt.site/home/people/b5ff5af7-1cb0-4d4e-8435-dbf5517085d0',
    name: 'Malcolm Sparks',
    staffRecord: { juxtcode: 'mal' },
  },
  {
    id: 'https://home.juxt.site/home/people/603e042f-ffe9-4d5f-b198-f8ad5f77443b',
    name: 'Jack Tolley',
    staffRecord: { juxtcode: 'jck' },
  },
  {
    id: 'https://home.juxt.site/home/people/e1a7992c-82c1-4ba9-9f01-a8ef13c0b6a4',
    name: 'Patrik K\xE5rlin',
    staffRecord: { juxtcode: 'pat' },
  },
  {
    id: 'https://home.juxt.site/home/people/1c4e3516-3847-462c-9641-47c8d4e7faf0',
    name: 'Yury Rojas',
    staffRecord: { juxtcode: 'yry' },
  },
  {
    id: 'https://home.juxt.site/home/people/5d1a0978-4b03-4701-b88a-c393863b0be3',
    name: 'Jason Paterson',
    staffRecord: { juxtcode: 'jsn' },
  },
  {
    id: 'https://home.juxt.site/home/people/5f3bc8b4-6c2f-46b3-8dfd-6efa88e71fc9',
    name: 'Peter Baker',
    staffRecord: { juxtcode: 'pbk' },
  },
  {
    id: 'https://home.juxt.site/home/people/5c52d95a-136b-4e2c-8224-72c369cf7a15',
    name: 'Jeremy Taylor',
    staffRecord: { juxtcode: 'jdt' },
  },
  {
    id: 'https://home.juxt.site/home/people/5dbacc91-43e2-47b3-bb99-8b24df0eee0c',
    name: 'Mike Bruce',
    staffRecord: { juxtcode: 'mic' },
  },
  {
    id: 'https://home.juxt.site/home/people/60f5f6c6-7990-4743-9786-9b2e786876e4',
    name: 'Renzo Borgatti',
    staffRecord: { juxtcode: 'ren' },
  },
  {
    id: 'https://home.juxt.site/home/people/613744a5-edd5-436d-8cc6-d778205ef600',
    name: 'Eirini Chatzidaki',
    staffRecord: { juxtcode: 'eix' },
  },
  {
    id: 'https://home.juxt.site/home/people/ecf6f85c-b48a-4fa1-bfcb-0c10de8db11c',
    name: 'Ovidiu Beldie',
    staffRecord: { juxtcode: 'ovi' },
  },
  {
    id: 'https://home.juxt.site/home/people/5ec5a42c-cbe2-45b0-9270-e87f6594a285',
    name: 'Carlos del Ojo',
    staffRecord: { juxtcode: 'coe' },
  },
  {
    id: 'https://home.juxt.site/home/people/149ce2b6-9559-4ab7-9f2f-1aa710d80782',
    name: 'David Emery',
    staffRecord: { juxtcode: 'dem' },
  },
  {
    id: 'https://home.juxt.site/home/people/18b108e2-92b7-4a0c-b511-ba568532040f',
    name: 'Finn V\xF6lkel',
    staffRecord: { juxtcode: 'fin' },
  },
  {
    id: 'https://home.juxt.site/home/people/f3d43f40-d91d-4a8a-9d7c-1dc1de16253d',
    name: 'Jamie Franklin',
    staffRecord: { juxtcode: 'jfr' },
  },
  {
    id: 'https://home.juxt.site/home/people/d497ec53-75dc-4441-a67d-fcbe2cef022e',
    name: 'Andrew Jackson',
    staffRecord: { juxtcode: 'and' },
  },
  {
    id: 'https://home.juxt.site/home/people/5fc4c08d-3c6c-46eb-8adb-83cb709730f6',
    name: 'Asel Kitulagoda',
    staffRecord: { juxtcode: 'asl' },
  },
  {
    id: 'https://home.juxt.site/home/people/612e39a2-36ab-4b20-99cb-e670472c3221',
    name: 'Syed Fathir',
    staffRecord: { juxtcode: 'saf' },
  },
  {
    id: 'https://home.juxt.site/home/people/29bed11b-1fbd-46fe-9206-cf804a9feef1',
    name: 'Andrew Baxter',
    staffRecord: { juxtcode: 'abx' },
  },
  {
    id: 'https://home.juxt.site/home/people/616eea5c-2523-47af-beab-ad1529905ed7',
    name: 'Julie Dang',
    staffRecord: { juxtcode: 'jdg' },
  },
  {
    id: 'https://home.juxt.site/home/people/b4b73b3a-9fe1-4a86-ab87-edfbff98bef2',
    name: 'Hugo Jacob',
    staffRecord: { juxtcode: 'hug' },
  },
  {
    id: 'https://home.juxt.site/home/people/5b8d045f-db3a-4d31-a6e7-ead6fe990979',
    name: "Lucio D'Alessandro",
    staffRecord: { juxtcode: 'lda' },
  },
  {
    id: 'https://home.juxt.site/home/people/60c24703-9f05-4f42-8dcc-6dde9f054a15',
    name: 'Timas Saltanavicius',
    staffRecord: { juxtcode: 'tms' },
  },
  {
    id: 'https://home.juxt.site/home/people/6093ead5-ccf0-453f-a233-c30624d7cf50',
    name: 'Andrea Pavan',
    staffRecord: { juxtcode: 'anp' },
  },
  {
    id: 'https://home.juxt.site/home/people/9dabe22f-bdc3-45ce-8b48-0fa168acb5af',
    name: 'Graham Clark',
    staffRecord: { juxtcode: 'gtc' },
  },
  {
    id: 'https://home.juxt.site/home/people/2bf11013-076c-4742-b969-588b81851734',
    name: 'Sarah Richardson-Kean',
    staffRecord: { juxtcode: 'srk' },
  },
  {
    id: 'https://home.juxt.site/home/people/59e47083-c60e-4cc4-bd82-9733d065bb20',
    name: 'Alex Davis',
    staffRecord: { juxtcode: 'alx' },
  },
  {
    id: 'https://home.juxt.site/home/people/bace31b1-c7da-48c7-abb2-b10e7537b900',
    name: 'Mark McElroy',
    staffRecord: { juxtcode: 'mkm' },
  },
  {
    id: 'https://home.juxt.site/home/people/19dece23-cb8f-4613-9449-4b04ed3b6e40',
    name: 'Catharine Channing',
    staffRecord: { juxtcode: 'cth' },
  },
  {
    id: 'https://home.juxt.site/home/people/2d2fe36d-064c-4a39-94ed-73dba30e8dd4',
    name: 'Tom Dalziel',
    staffRecord: { juxtcode: 'tom' },
  },
  {
    id: 'https://home.juxt.site/home/people/618a4dd1-3b55-46e0-931a-fe33fd8e5b06',
    name: 'William Caine',
    staffRecord: { juxtcode: 'wac' },
  },
  {
    id: 'https://home.juxt.site/home/people/5da5ea4b-fb6e-4009-b689-c48cb305fa6f',
    name: 'James Henderson',
    staffRecord: { juxtcode: 'jms' },
  },
  {
    id: 'https://home.juxt.site/home/people/79ee328d-4665-474c-a07e-f3efb177ef1f',
    name: 'Thomas Taylor',
    staffRecord: { juxtcode: 'tmt' },
  },
  {
    id: 'https://home.juxt.site/home/people/5fbf7b95-c991-45b1-84b4-38373dc463ab',
    name: "Alistair O'Neill",
    staffRecord: { juxtcode: 'aon' },
  },
  {
    id: 'https://home.juxt.site/home/people/607a9d8b-d00d-40a8-a373-b00e2fd86ebe',
    name: 'James Simpson',
    staffRecord: { juxtcode: 'jss' },
  },
  {
    id: 'https://home.juxt.site/home/people/6e88e787-ec63-404c-93ea-96df2d7b7413',
    name: 'Yury Zaytsev',
    staffRecord: { juxtcode: 'yry' },
  },
  {
    id: 'https://home.juxt.site/home/people/60daf2e3-b675-434c-a93e-7b316cde1107',
    name: 'Werner Kok',
    staffRecord: { juxtcode: 'wrk' },
  },
  {
    id: 'https://home.juxt.site/home/people/608ab01e-8183-418b-8d19-9bf85f6d29d1',
    name: 'Joe Littlejohn',
    staffRecord: { juxtcode: 'joe' },
  },
  {
    id: 'https://home.juxt.site/home/people/75152717-369f-4c9a-8521-18d7590a0bbe',
    name: 'Ben Latchford',
    staffRecord: { juxtcode: 'bnl' },
  },
  {
    id: 'https://home.juxt.site/home/people/5ffe9da9-ff70-44a6-8f3e-24c33fcebe71',
    name: 'Max Grant-Walker',
    staffRecord: { juxtcode: 'max' },
  },
  {
    id: 'https://home.juxt.site/home/people/619635c5-6e15-46e5-8534-a542f91ee699',
    name: 'Ashwin Prasanna',
    staffRecord: { juxtcode: 'apr' },
  },
  {
    id: 'https://home.juxt.site/home/people/5fbf7d29-e2eb-44bb-a06e-18a878668db3',
    name: 'John Mone',
    staffRecord: { juxtcode: 'jmo' },
  },
  {
    id: 'https://home.juxt.site/home/people/e1aff319-1a82-48f2-9a76-ef53cda61698',
    name: 'Caroline Appleby',
    staffRecord: { juxtcode: 'cla' },
  },
  {
    id: 'https://home.juxt.site/home/people/5fbe24cb-2c24-4d5d-a024-8cede460980e',
    name: 'Matt Ford',
    staffRecord: { juxtcode: 'mtf' },
  },
  {
    id: 'https://home.juxt.site/home/people/5021cd02-ce46-41b1-afd3-9fa39b5bb920',
    name: 'Remy Rojas',
    staffRecord: { juxtcode: 'rro' },
  },
  {
    id: 'https://home.juxt.site/home/people/5e8b8cd2-0166-427d-9f37-81cc6bda332e',
    name: 'Hugo Young',
    staffRecord: { juxtcode: 'hjy' },
  },
  {
    id: 'https://home.juxt.site/home/people/5f4f73bf-1330-4642-989a-107d2037ec3b',
    name: 'Andrea Crotti',
    staffRecord: { juxtcode: 'anc' },
  },
  {
    id: 'https://home.juxt.site/home/people/2d8ced05-12c7-4603-b263-b80f2b7bd958',
    name: 'Jon Pither',
    staffRecord: { juxtcode: 'jon' },
  },
  {
    id: 'https://home.juxt.site/home/people/467eabea-e059-4cbd-bb0c-4b19c2c072c6',
    name: 'Ben Gerard',
    staffRecord: { juxtcode: 'bng' },
  },
]);
function ia({ forwardedRef: e, items: r, onSelect: a, renderItem: o }) {
  const [n, i] = $.useState(0),
    c = $.useRef(null),
    m = $.useRef(null);
  function s(l) {
    const u = r[l];
    u && a(u);
  }
  return (
    $.useEffect(
      function () {
        var u;
        (u = c.current) == null ||
          u
            .osInstance()
            .scroll({ el: m.current, scroll: { y: 'ifneeded', x: 'never' } });
      },
      [n],
    ),
    $.useImperativeHandle(e, () => ({
      onKeyDown: ({ event: l }) =>
        l.key === 'ArrowUp'
          ? (i((n + r.length - 1) % r.length), !0)
          : l.key === 'ArrowDown'
          ? (i((n + 1) % r.length), !0)
          : l.key === 'Enter'
          ? (s(n), !0)
          : !1,
    })),
    r.length === 0
      ? null
      : t(lr, {
          className: 'SuggestionDropdown',
          ref: c,
          children: t('ul', {
            children: r.map((l, u) =>
              t(
                'button',
                {
                  type: 'button',
                  className: T({ selected: u === n }),
                  onClick: () => s(u),
                  children: t('li', {
                    ref: u === n ? m : null,
                    children: o(l),
                  }),
                },
                u,
              ),
            ),
          }),
        })
  );
}
const la = $.forwardRef(({ items: e, command: r }, a) =>
    t(ia, {
      forwardedRef: a,
      items: e,
      onSelect: r,
      renderItem: ({ name: o, staffRecord: n }) =>
        d('div', {
          className: 'MentionDropdownItem',
          children: [
            t('img', {
              className: 'avatar',
              alt: 'avatar',
              src: `https://home.juxt.site/profiles/${n.juxtcode}.jpg`,
            }),
            t('span', { className: 'name', children: o }),
          ],
        }),
    }),
  ),
  da = dr.create({
    name: 'mentionSuggestion',
    group: 'inline',
    inline: !0,
    selectable: !1,
    atom: !0,
    addOptions() {
      return {
        suggestion: {
          char: '@',
          allowSpaces: !0,
          command: ({ editor: e, range: r, props: a }) => {
            e.chain()
              .focus()
              .insertContentAt(r, [
                { type: 'mentionSuggestion', attrs: a },
                { type: 'text', text: ' ' },
              ])
              .run();
          },
          allow: ({ editor: e, range: r }) =>
            e.can().insertContentAt(r, { type: 'mentionSuggestion' }),
          items: ({ query: e }) =>
            sa.filter(({ name: r }) =>
              r.toLowerCase().includes(e.toLowerCase()),
            ),
          render: () => {
            let e, r;
            return {
              onStart: (a) => {
                (e = new cr(la, { props: a, editor: a.editor })),
                  (r = mr('body', {
                    getReferenceClientRect: a.clientRect,
                    appendTo: () => document.body,
                    content: e.element,
                    showOnCreate: !0,
                    interactive: !0,
                    trigger: 'manual',
                    placement: 'bottom-start',
                  }));
              },
              onUpdate(a) {
                e.updateProps(a),
                  r[0].setProps({ getReferenceClientRect: a.clientRect });
              },
              onKeyDown(a) {
                var o;
                return a.event.key === 'Escape'
                  ? (r[0].hide(), !0)
                  : Boolean((o = e.ref) == null ? void 0 : o.onKeyDown(a));
              },
              onExit() {
                r[0].destroy(), e.destroy();
              },
            };
          },
        },
      };
    },
    addAttributes() {
      return {
        id: { default: null, renderHTML: (e) => ({ 'data-user-id': e.id }) },
        name: {
          default: null,
          parseHTML: (e) => {
            var r;
            return (r = e.getAttribute('aria-label')) == null
              ? void 0
              : r.split(/\s(.+)/)[1];
          },
          renderHTML: (e) => ({ 'aria-label': `Name: ${e.name}` }),
        },
      };
    },
    parseHTML() {
      return [{ tag: 'span[data-mention]' }];
    },
    renderHTML({ node: e, HTMLAttributes: r }) {
      return [
        'span',
        ur({ 'data-mention': '' }, r),
        ['span', { class: 'char' }, this.options.suggestion.char],
        ['span', { class: 'name' }, e.attrs.name],
      ];
    },
    renderText({ node: e }) {
      return `${this.options.suggestion.char}${e.attrs.name}`;
    },
    addProseMirrorPlugins() {
      return [pr(h({ editor: this.editor }, this.options.suggestion))];
    },
  });
function Lt({
  content: e = '',
  onChange: r,
  editable: a = !0,
  placeholder: o = 'Write something...',
  withTypographyExtension: n = !1,
  withLinkExtension: i = !1,
  withTaskListExtension: c = !1,
  withPlaceholderExtension: m = !1,
  withMentionSuggestion: s = !1,
}) {
  const l = [hr.configure(), fr];
  n && l.push(Nr),
    i && l.push(gr.configure({ linkOnPaste: !1, openOnClick: !1 })),
    c && l.push(xr, br),
    m && l.push(yr.configure({ placeholder: o })),
    s && l.push(da);
  const [, u] = $.useState((e == null ? void 0 : e.trim()) || 'a'),
    g = vr({
      content: e,
      extensions: l,
      editable: a,
      onUpdate: ({ editor: v }) => {
        u(v.getHTML()), r(v.getHTML());
      },
    });
  return g
    ? t('div', { className: 'w-full', children: t(wr, { editor: g }) })
    : null;
}
function ca({ className: e }) {
  return t('svg', {
    className: e,
    stroke: 'currentColor',
    fill: 'currentColor',
    strokeWidth: '0',
    viewBox: '0 0 320 512',
    height: '1em',
    width: '1em',
    xmlns: 'http://www.w3.org/2000/svg',
    children: t('path', {
      d: 'M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41zm255-105L177 64c-9.4-9.4-24.6-9.4-33.9 0L24 183c-15.1 15.1-4.4 41 17 41h238c21.4 0 32.1-25.9 17-41z',
    }),
  });
}
function ma({ className: e }) {
  return t('svg', {
    className: e,
    stroke: 'currentColor',
    fill: 'currentColor',
    strokeWidth: '0',
    viewBox: '0 0 320 512',
    height: '1em',
    width: '1em',
    xmlns: 'http://www.w3.org/2000/svg',
    children: t('path', {
      d: 'M279 224H41c-21.4 0-32.1-25.9-17-41L143 64c9.4-9.4 24.6-9.4 33.9 0l119 119c15.2 15.1 4.5 41-16.9 41z',
    }),
  });
}
function ua({ className: e }) {
  return t('svg', {
    className: e,
    stroke: 'currentColor',
    fill: 'currentColor',
    strokeWidth: '0',
    viewBox: '0 0 320 512',
    height: '1em',
    width: '1em',
    xmlns: 'http://www.w3.org/2000/svg',
    children: t('path', {
      d: 'M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41z',
    }),
  });
}
function Vt(e) {
  return d(
    'svg',
    y(h({}, e), {
      viewBox: '0 0 20 20',
      fill: 'none',
      xmlns: 'http://www.w3.org/2000/svg',
      children: [
        t('rect', {
          x: '5',
          y: '6',
          width: '10',
          height: '10',
          fill: '#EDE9FE',
          stroke: '#A78BFA',
          strokeWidth: '2',
        }),
        t('path', { d: 'M3 6H17', stroke: '#A78BFA', strokeWidth: '2' }),
        t('path', { d: 'M8 6V4H12V6', stroke: '#A78BFA', strokeWidth: '2' }),
      ],
    }),
  );
}
function qt(e) {
  return d(
    'svg',
    y(h({}, e), {
      viewBox: '0 0 20 20',
      fill: 'none',
      xmlns: 'http://www.w3.org/2000/svg',
      children: [
        t('rect', {
          x: '5',
          y: '6',
          width: '10',
          height: '10',
          fill: '#8B5CF6',
          stroke: '#C4B5FD',
          strokeWidth: '2',
        }),
        t('path', { d: 'M3 6H17', stroke: '#C4B5FD', strokeWidth: '2' }),
        t('path', { d: 'M8 6V4H12V6', stroke: '#C4B5FD', strokeWidth: '2' }),
      ],
    }),
  );
}
function pa(e) {
  return d(
    'svg',
    y(h({}, e), {
      viewBox: '0 0 20 20',
      fill: 'none',
      xmlns: 'http://www.w3.org/2000/svg',
      children: [
        t('rect', {
          x: '5',
          y: '8',
          width: '10',
          height: '8',
          fill: '#EDE9FE',
          stroke: '#A78BFA',
          strokeWidth: '2',
        }),
        t('rect', {
          x: '4',
          y: '4',
          width: '12',
          height: '4',
          fill: '#EDE9FE',
          stroke: '#A78BFA',
          strokeWidth: '2',
        }),
        t('path', { d: 'M8 12H12', stroke: '#A78BFA', strokeWidth: '2' }),
      ],
    }),
  );
}
function ha(e) {
  return d(
    'svg',
    y(h({}, e), {
      viewBox: '0 0 20 20',
      fill: 'none',
      xmlns: 'http://www.w3.org/2000/svg',
      children: [
        t('rect', {
          x: '5',
          y: '8',
          width: '10',
          height: '8',
          fill: '#8B5CF6',
          stroke: '#C4B5FD',
          strokeWidth: '2',
        }),
        t('rect', {
          x: '4',
          y: '4',
          width: '12',
          height: '4',
          fill: '#8B5CF6',
          stroke: '#C4B5FD',
          strokeWidth: '2',
        }),
        t('path', { d: 'M8 12H12', stroke: '#A78BFA', strokeWidth: '2' }),
      ],
    }),
  );
}
const rt =
  'relative inline-flex w-full rounded leading-none transition-colors ease-in-out placeholder-gray-500 text-gray-700 bg-gray-50 border border-gray-300 hover:border-blue-400 focus:outline-none focus:border-blue-400 focus:ring-blue-400 focus:ring-4 focus:ring-opacity-30 p-3 text-base';
function fa(e) {
  return t(st, h({}, e));
}
function ga({ image: e, title: r }) {
  return t('li', {
    className: T('block p-1 h-24 isolate', ' w-full pb-5'),
    children: d('article', {
      className:
        'group hasImage w-full h-full rounded-md focus:outline-none focus:shadow-outline bg-gray-100 relative  shadow-sm',
      children: [
        t('img', {
          alt: 'upload preview',
          className: T('w-full h-full rounded-md bg-fixed', 'object-contain'),
          src: e,
        }),
        t('section', {
          className:
            'flex flex-col justify-between rounded-md text-xs break-words w-full py-2 px-3',
          children: t('h1', { className: 'truncate', children: r }),
        }),
      ],
    }),
  });
}
function De({ file: e, handleDelete: r }) {
  if (!e) return t('div', { children: 'No file' });
  const a = [
    {
      label: 'Delete',
      id: 'delete',
      Icon: Vt,
      ActiveIcon: qt,
      props: { onClick: r },
    },
    {
      label: 'Download',
      ActiveIcon: Xe,
      Icon: Xe,
      id: 'download',
      props: { href: e.base64, download: e.name },
    },
  ];
  return d('div', {
    className: 'flex flex-row justify-between',
    children: [
      e.type.startsWith('image')
        ? t(ga, { title: e.name, image: e.base64 })
        : d('div', {
            className: 'w-5/6',
            children: [
              d('p', { children: ['Type: ', e.type] }),
              t('h1', { className: 'truncate max-w-fit', children: e.name }),
            ],
          }),
      r && t($e, { options: a }),
    ],
  });
}
function xa({ error: e }) {
  return e ? t('p', { className: 'text-red-600', children: e.message }) : null;
}
function Pe({ field: e, props: r }) {
  const { control: a, register: o } = r.formHooks,
    n = o(e.path, e.rules),
    i = y(h({}, n), { className: rt, type: e.type });
  switch (e.type) {
    case 'text':
      return t('input', h({}, i));
    case 'number':
      return t('input', h({}, i));
    case 'checkbox':
      return t('input', y(h({}, i), { checked: !!e.value }));
    case 'file':
      return t(ce, {
        render: (c) => {
          const { onChange: m, value: s } = c.field,
            l = async (g, v) => {
              const p = g[0];
              v.forEach((N) => {
                Q.error(
                  `Couldn't upload file ${N.file.name}. ${N.errors
                    .map((C) => C.message)
                    .join(', ')}`,
                );
              });
              const f = await tt(p),
                x = { name: p.name, type: p.type, base64: f };
              m(x);
            },
            u = s;
          return t(Ge, {
            onDrop: l,
            accept: e.accept,
            maxSize: 5e6,
            children: ({
              getRootProps: g,
              getInputProps: v,
              isDragAccept: p,
              isDragActive: f,
              isDragReject: x,
            }) => {
              var N, C;
              return t('section', {
                children: u
                  ? t('div', {
                      className: 'pt-2 text-gray-800 text-sm',
                      children: t('div', {
                        className: 'pt-2 mt-2',
                        children: t(De, {
                          file: u,
                          handleDelete: () => m(null),
                        }),
                      }),
                    })
                  : t(
                      'div',
                      y(h({}, g()), {
                        children: t('div', {
                          className: T(
                            'max-w-lg flex justify-center cursor-pointer px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md',
                            f && 'border-blue-500',
                            p && 'border-green-500 cursor-copy',
                            x && 'border-red-500 cursor-no-drop',
                          ),
                          children: d('div', {
                            className: 'space-y-1 text-center',
                            children: [
                              t('div', {
                                className: 'flex text-sm text-gray-600',
                                children: d('label', {
                                  htmlFor: 'file-upload',
                                  className:
                                    'relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500',
                                  children: [
                                    t('input', h({}, v())),
                                    t('p', {
                                      children:
                                        'Drag a file here, or click to select a file',
                                    }),
                                  ],
                                }),
                              }),
                              d('p', {
                                className: 'text-xs text-gray-500',
                                children: [
                                  (C =
                                    (N = e.accept) == null
                                      ? void 0
                                      : N.toString()) == null
                                    ? void 0
                                    : C.replaceAll(
                                        /image\/|application\//g,
                                        '',
                                      ).toLocaleUpperCase(),
                                  ' ',
                                  'up to 5MB',
                                ],
                              }),
                            ],
                          }),
                        }),
                      }),
                    ),
              });
            },
          });
        },
        name: e.path,
        control: a,
        rules: e.rules,
      });
    case 'multifile':
      return t(ce, {
        render: (c) => {
          const { onChange: m, value: s } = c.field,
            l =
              Array.isArray(s) && s.filter(M).length > 0 ? s.filter(M) : void 0,
            u = (v) => {
              const p = l == null ? void 0 : l.filter((f) => f !== v);
              m(p);
            };
          return t(Ge, {
            onDrop: async (v, p) => {
              p.forEach((f) => {
                Q.error(
                  `Couldn't upload file ${f.file.name}. ${f.errors
                    .map((x) => x.message)
                    .join(', ')}`,
                );
              }),
                v.filter(M).map(async (f) => {
                  const x = await tt(f),
                    N = { name: f.name, type: f.type, base64: x },
                    C = [...(l || []), N];
                  m(C);
                });
            },
            accept: e.accept,
            multiple: !0,
            maxSize: 5e6,
            children: ({
              getRootProps: v,
              getInputProps: p,
              isDragAccept: f,
              isDragActive: x,
              isDragReject: N,
            }) => {
              var C, I;
              return d('section', {
                children: [
                  t(
                    'div',
                    y(h({}, v()), {
                      children: t('div', {
                        className: T(
                          'max-w-lg flex justify-center cursor-pointer px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md',
                          x && 'border-blue-500',
                          f && 'border-green-500 cursor-copy',
                          N && 'border-red-500 cursor-no-drop',
                        ),
                        children: d('div', {
                          className: 'space-y-1 text-center',
                          children: [
                            t('div', {
                              className: 'flex text-sm text-gray-600',
                              children: d('label', {
                                htmlFor: 'file-upload',
                                className:
                                  'relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500',
                                children: [
                                  t('input', h({}, p())),
                                  t('p', {
                                    children:
                                      'Drag some files here, or click to select files',
                                  }),
                                ],
                              }),
                            }),
                            d('p', {
                              className: 'text-xs text-gray-500',
                              children: [
                                (I =
                                  (C = e.accept) == null
                                    ? void 0
                                    : C.toString()) == null
                                  ? void 0
                                  : I.replaceAll(
                                      /image\/|application\//g,
                                      '',
                                    ).toLocaleUpperCase(),
                                ' ',
                                'up to 5MB',
                              ],
                            }),
                          ],
                        }),
                      }),
                    }),
                  ),
                  l &&
                    d('div', {
                      className: 'pt-2 text-gray-800 text-sm',
                      children: [
                        l.length,
                        ' files selected',
                        l
                          .filter(M)
                          .map((j) =>
                            t(
                              'div',
                              {
                                className: 'pt-2 mt-2',
                                children: t(De, {
                                  file: j,
                                  handleDelete: () => u(j),
                                }),
                              },
                              j.name,
                            ),
                          ),
                      ],
                    }),
                ],
              });
            },
          });
        },
        name: e.path,
        control: a,
        rules: e.rules,
      });
    case 'select':
      return t(ce, {
        name: e.path,
        control: a,
        render: (c) => {
          const { value: m, onChange: s, name: l } = c.field;
          return t(
            fa,
            y(h({}, c), {
              options: e.options,
              onChange: (u) => {
                s(u);
              },
              value: m,
              name: l,
            }),
          );
        },
      });
    case 'multiselect':
      return t(ce, {
        name: e.path,
        control: a,
        render: (c) => {
          const { value: m, onChange: s, name: l } = c.field;
          return t(Cr, {
            onChange: s,
            value: m || [],
            valueRenderer: (u) => u.map((g) => g.label).join(', '),
            options: e.options,
            labelledBy: l,
          });
        },
      });
    case 'textarea':
      return t('textarea', y(h(h({}, i), e), { className: rt }));
    case 'tiptap':
      return t(ce, {
        name: e.path,
        control: a,
        render: (c) => {
          const { value: m, onChange: s } = c.field,
            [l, u] = D.exports.useState(!!m);
          D.exports.useEffect(() => {
            l !== !!m && u(!!m);
          }, [m]);
          const g = t(
            Lt,
            h(
              {
                onChange: s,
                content: m,
                withTaskListExtension: !0,
                withLinkExtension: !0,
                withTypographyExtension: !0,
                withPlaceholderExtension: !0,
                withMentionSuggestion: !0,
              },
              e,
            ),
          );
          return l
            ? g
            : t('button', {
                type: 'button',
                className:
                  'inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
                onClick: () => u(!0),
                children: 'Add description',
              });
        },
      });
    case 'hidden':
      return t('input', y(h({}, i), { type: 'hidden' }));
    default:
      return null;
  }
}
function Be(e) {
  const {
      fields: r,
      formHooks: a,
      title: o,
      id: n,
      description: i,
      onSubmit: c,
    } = e,
    {
      formState: { errors: m },
    } = a;
  return t('form', {
    id: n || o,
    onSubmit: c,
    children: d('div', {
      className: 'bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4',
      children: [
        t('div', {
          className: 'sm:flex sm:items-start',
          children: d('div', {
            className: 'mt-3 text-center sm:mt-0 sm:text-left',
            children: [
              t(ke.Title, {
                as: 'h3',
                className: 'text-lg leading-6 font-medium text-gray-900',
                children: o,
              }),
              i &&
                t('div', {
                  className: 'mt-2',
                  children: t('p', {
                    className: 'text-sm text-gray-500',
                    children: i,
                  }),
                }),
            ],
          }),
        }),
        t('div', {
          className: 'space-y-8 divide-y divide-gray-200 sm:space-y-5',
          children: d('div', {
            children: [
              t('div', {
                children:
                  i &&
                  t('p', {
                    className: 'mt-1 max-w-2xl text-sm text-gray-500',
                    children: i,
                  }),
              }),
              d('div', {
                className: 'mt-6 sm:mt-5 space-y-6 sm:space-y-5',
                children: [
                  r == null
                    ? void 0
                    : r
                        .filter((s) => s.type === 'hidden')
                        .map((s) => t(Pe, { field: s, props: e }, s.path)),
                  r == null
                    ? void 0
                    : r
                        .filter((s) => s.type !== 'hidden')
                        .map((s) => {
                          const l = (s == null ? void 0 : s.label) || s.path,
                            u = le.get(m, s.path);
                          return d(
                            'div',
                            {
                              className:
                                'sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5',
                              children: [
                                t('label', {
                                  htmlFor: l,
                                  className:
                                    'block capitalize text-sm font-medium text-gray-700 sm:mt-px',
                                  children: l,
                                }),
                                t('div', {
                                  className: 'mt-1 sm:mt-0 sm:col-span-2',
                                  children: t(Pe, { field: s, props: e }),
                                }),
                                u &&
                                  t('p', {
                                    className: 'text-red-500',
                                    children:
                                      u.message || 'This field is required',
                                  }),
                              ],
                            },
                            s.id,
                          );
                        }),
                ],
              }),
            ],
          }),
        }),
      ],
    }),
  });
}
function we({
  isOpen: e,
  handleClose: r,
  fullWidth: a,
  noScroll: o,
  className: n,
  children: i,
}) {
  return t(ue.Root, {
    show: e,
    as: D.exports.Fragment,
    children: t(ke, {
      as: 'div',
      className: T('fixed z-10 inset-0', !o && 'overflow-y-auto'),
      onClose: r,
      children: d('div', {
        className:
          'flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:py-0',
        children: [
          t(ue.Child, {
            as: D.exports.Fragment,
            enter: 'ease-out duration-300',
            enterFrom: 'opacity-0',
            enterTo: 'opacity-100',
            leave: 'ease-in duration-200',
            leaveFrom: 'opacity-100',
            leaveTo: 'opacity-0',
            children: t(ke.Overlay, {
              className:
                'fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity',
            }),
          }),
          t('span', {
            className: 'hidden sm:inline-block sm:align-middle sm:h-screen',
            'aria-hidden': 'true',
            children: '\u200B',
          }),
          t(ue.Child, {
            as: D.exports.Fragment,
            enter: 'ease-out duration-300',
            enterFrom: 'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95',
            enterTo: 'opacity-100 translate-y-0 sm:scale-100',
            leave: 'ease-in duration-200',
            leaveFrom: 'opacity-100 translate-y-0 sm:scale-100',
            leaveTo: 'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95',
            children: t('div', {
              className: T(
                'relative w-full inline-block align-bottom',
                'bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all',
                ' sm:align-middle sm:w-full h-screen-90 ',
                !o && 'overflow-y-auto',
                !a && 'sm:max-w-4xl',
                n,
              ),
              children: t('div', {
                className: 'h-full flex flex-col justify-between',
                children: i,
              }),
            }),
          }),
        ],
      }),
    }),
  });
}
function Ne(e) {
  return d(
    we,
    y(h({}, e), {
      children: [
        t(Be, y(h({}, e), { onSubmit: e.onSubmit })),
        d('div', {
          className: 'bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse',
          children: [
            t('button', {
              type: 'submit',
              form: (e == null ? void 0 : e.id) || e.title,
              className:
                'w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm',
              children: 'Submit',
            }),
            t('button', {
              type: 'button',
              className:
                'mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm',
              onClick: e.handleClose,
              children: 'Cancel',
            }),
          ],
        }),
      ],
    }),
  );
}
function ba({ isOpen: e, handleClose: r }) {
  const a = G(),
    o = jt(h({}, Z(a))),
    { modalState: n } = H(),
    i = n == null ? void 0 : n.workflowId,
    c = He().data || [],
    m = (l) => {
      if (i) {
        r();
        const u = `col-${Date.now()}`;
        o.mutate(
          y(h({}, l), {
            workflowStateIds: [...c.map((g) => g.id), u],
            workflowId: i,
            colId: u,
          }),
        );
      }
    },
    s = re();
  return t(Ne, {
    title: 'Add WorkflowState',
    formHooks: s,
    onSubmit: s.handleSubmit(m, console.warn),
    isOpen: e,
    handleClose: r,
    fields: [
      {
        id: 'name',
        path: 'workflowStateName',
        rules: { required: !0 },
        label: 'WorkflowState Name',
        type: 'text',
      },
    ],
  });
}
function ya({ isOpen: e, handleClose: r }) {
  var l;
  const a = G(),
    o = $t(h({}, Z(a))),
    { modalState: n } = H(),
    i = n == null ? void 0 : n.workflowStateId,
    c = (l = ea(i)) == null ? void 0 : l.data,
    m = (u) => {
      i && (r(), o.mutate(y(h({}, u), { colId: i })));
    },
    s = re();
  return (
    D.exports.useEffect(() => {
      c &&
        (s.setValue('name', c.name),
        (c == null ? void 0 : c.description) &&
          s.setValue('description', c.description));
    }, [c]),
    t(Ne, {
      title: 'Update Column',
      formHooks: s,
      onSubmit: s.handleSubmit(m, console.warn),
      isOpen: e,
      handleClose: r,
      fields: [
        {
          id: 'name',
          path: 'name',
          rules: { required: !0 },
          label: 'Column Name',
          type: 'text',
        },
        {
          id: 'description',
          path: 'description',
          label: 'Description',
          type: 'text',
        },
      ],
    })
  );
}
function va({ isOpen: e, handleClose: r }) {
  const a = Nt(h({}, Z)),
    o = (i) => {
      r(),
        Q.promise(a.mutateAsync(i), {
          pending: 'Creating project...',
          success: 'Project created!',
          error: 'Error creating project',
        });
    },
    n = re();
  return t(Ne, {
    title: 'Add Project',
    formHooks: n,
    fields: [
      {
        id: 'ProjectName',
        placeholder: 'Project Name',
        label: 'Project Name',
        type: 'text',
        rules: { required: !0 },
        path: 'project.name',
      },
      {
        id: 'ProjectDescription',
        label: 'Project Description',
        placeholder: 'Project Description',
        type: 'text',
        path: 'workflowProject.description',
      },
    ],
    onSubmit: n.handleSubmit(o, console.warn),
    isOpen: e,
    handleClose: r,
  });
}
function wa({ isOpen: e, handleClose: r }) {
  const { modalState: a } = H(),
    o = a == null ? void 0 : a.projectId,
    n = G(),
    i = Ht(h({}, Z(n))),
    c = (u) => {
      r(), i.mutate(h({}, u));
    },
    m = Ot().data,
    s = re({ defaultValues: { projectId: o } });
  D.exports.useEffect(() => {
    m && s.setValue('project', h({}, m));
  }, [m]);
  const l = 'Update Project';
  return d(we, {
    isOpen: e,
    handleClose: r,
    children: [
      t('div', {
        children: t(Be, {
          title: l,
          formHooks: s,
          fields: [
            {
              id: 'ProjectName',
              placeholder: 'Project Name',
              type: 'text',
              rules: { required: !0 },
              path: 'project.name',
              label: 'Name',
            },
            {
              id: 'ProjectDescription',
              label: 'Project Description',
              placeholder: 'Project Description',
              type: 'text',
              path: 'workflowProject.description',
            },
          ],
          onSubmit: s.handleSubmit(c, console.warn),
        }),
      }),
      d('div', {
        className: 'bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse',
        children: [
          t('button', {
            type: 'submit',
            form: l,
            className:
              'w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm',
            children: 'Submit',
          }),
          t('button', {
            type: 'button',
            className:
              'mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm',
            onClick: () => r(),
            children: 'Cancel',
          }),
        ],
      }),
    ],
  });
}
function ie(n) {
  var i = n,
    { children: e, className: r, primary: a } = i,
    o = te(i, ['children', 'className', 'primary']);
  return t(
    'button',
    y(
      h(
        {
          type: 'button',
          className: T(
            'relative disabled:opacity-50 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white hover:bg-gray-50',
            r,
            a &&
              'w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm',
            a ? 'text-white' : 'text-gray-700',
          ),
        },
        o,
      ),
      { children: e },
    ),
  );
}
function be(o) {
  var n = o,
    { children: e, className: r } = n,
    a = te(n, ['children', 'className']);
  return t(
    'button',
    y(
      h(
        {
          type: 'button',
          className: T(
            'relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50',
            r,
          ),
        },
        a,
      ),
      { children: e },
    ),
  );
}
function Na({ preGlobalFilteredRows: e, globalFilter: r, setGlobalFilter: a }) {
  const o = e.length,
    [n, i] = D.exports.useState(r),
    c = (m) => a(m || '');
  return d('label', {
    htmlFor: 'table-global-search',
    className: 'flex gap-x-2 items-baseline',
    children: [
      t('span', { className: 'text-gray-700', children: 'Search: ' }),
      t('input', {
        id: 'table-global-search',
        type: 'text',
        className:
          'rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50',
        value: n || '',
        onChange: (m) => {
          i(m.target.value), c(m.target.value);
        },
        placeholder: `${o} records...`,
      }),
    ],
  });
}
function Ca({
  column: {
    filterValue: e,
    setFilter: r,
    preFilteredRows: a,
    id: o,
    render: n,
  },
}) {
  const i = D.exports.useMemo(() => {
      const l = new Set();
      return (
        a.forEach((u) => {
          l.add(u.values[o]);
        }),
        [...l.values()]
      );
    }, [o, a]),
    c = ee(),
    m = H(),
    { filters: s } = m;
  return (
    D.exports.useEffect(() => {
      (s == null ? void 0 : s[o]) && r(s[o]);
    }, [s, o]),
    d('label', {
      htmlFor: o,
      className: 'flex gap-x-2 items-baseline',
      children: [
        d('span', {
          className: 'text-gray-700',
          children: [n('Header'), ': '],
        }),
        d('select', {
          className:
            'rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50',
          name: o,
          id: o,
          value: e || '',
          onChange: (l) => {
            c({
              search: y(h({}, m), {
                filters: y(h({}, m.filters), { [o]: l.target.value }),
              }),
            }),
              r(l.target.value || void 0);
          },
          children: [
            t('option', { value: '', children: 'All' }),
            i.map((l) => t('option', { value: l, children: l }, l)),
          ],
        }),
      ],
    })
  );
}
function Ut({ onRowClick: e, columns: r, data: a }) {
  const {
      getTableProps: o,
      getTableBodyProps: n,
      headerGroups: i,
      prepareRow: c,
      page: m,
      canPreviousPage: s,
      canNextPage: l,
      pageOptions: u,
      pageCount: g,
      gotoPage: v,
      nextPage: p,
      previousPage: f,
      setPageSize: x,
      state: N,
      preGlobalFilteredRows: C,
      setGlobalFilter: I,
      setAllFilters: j,
    } = me.exports.useTable(
      { columns: r, data: a, autoResetFilters: !1 },
      me.exports.useFilters,
      me.exports.useGlobalFilter,
      me.exports.useSortBy,
      me.exports.usePagination,
    ),
    A = l || s,
    B = ee(),
    E = H();
  return d(J, {
    children: [
      d('div', {
        className: 'sm:flex sm:gap-x-2 items-center  mt-4',
        children: [
          t(Na, {
            preGlobalFilteredRows: C,
            globalFilter: N.globalFilter,
            setGlobalFilter: I,
          }),
          i.map((R) =>
            R.headers.map((b) =>
              b.Filter
                ? t('div', { children: b.render('Filter') }, b.id)
                : null,
            ),
          ),
          t('button', {
            type: 'button',
            className:
              'inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
            onClick: () => (
              B({ search: y(h({}, E), { filters: void 0 }) }), j([])
            ),
            children: 'Reset',
          }),
        ],
      }),
      t('div', {
        className: T('mt-4 flexw-full  flex-col md:w-full', !A && 'pb-4'),
        children: t('div', {
          className: '-my-2 overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8',
          children: t('div', {
            className: 'py-2 align-middle inline-block sm:px-6 lg:px-8 w-full',
            children: t('div', {
              className:
                'relative sm:shadow overflow-hidden border-b border-gray-200 sm:rounded-lg',
              children: d(
                'table',
                y(h({}, o()), {
                  className: 'divide-y divide-gray-200 w-full',
                  children: [
                    t('thead', {
                      className:
                        'bg-gray-50 sm:visible invisible absolute sm:relative',
                      children: i.map((R) =>
                        t(
                          'tr',
                          y(h({}, R.getHeaderGroupProps()), {
                            children: R.headers.map((b) =>
                              t(
                                'th',
                                y(
                                  h(
                                    {
                                      scope: 'col',
                                      className:
                                        'group px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                                    },
                                    b.getHeaderProps(b.getSortByToggleProps()),
                                  ),
                                  {
                                    style: {
                                      width: b.width,
                                      minWidth: b.minWidth,
                                      maxWidth: b.maxWidth,
                                    },
                                    children: d('div', {
                                      className:
                                        'flex items-center justify-between',
                                      children: [
                                        b.render('Header'),
                                        t('span', {
                                          children: b.isSorted
                                            ? b.isSortedDesc
                                              ? t(ua, {
                                                  className:
                                                    'w-4 h-4 text-gray-400',
                                                })
                                              : t(ma, {
                                                  className:
                                                    'w-4 h-4 text-gray-400',
                                                })
                                            : t(ca, {
                                                className:
                                                  'w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100',
                                              }),
                                        }),
                                      ],
                                    }),
                                  },
                                ),
                              ),
                            ),
                          }),
                        ),
                      ),
                    }),
                    t(
                      'tbody',
                      y(h({}, n()), {
                        className: 'bg-white divide-y divide-gray-200',
                        children: m.map(
                          (R) => (
                            c(R),
                            t(
                              'tr',
                              y(
                                h(
                                  {
                                    className: T(
                                      'shadow-lg sm:shadow-none mb-6 sm:mb-0 flex flex-row flex-wrap sm:table-row sm:hover:bg-gray-100',
                                      e && 'cursor-pointer',
                                    ),
                                    onClick: () => e && e(R),
                                  },
                                  R.getRowProps(),
                                ),
                                {
                                  children: R.cells.map((b) => {
                                    var S;
                                    const w =
                                      (S = b == null ? void 0 : b.column) ==
                                      null
                                        ? void 0
                                        : S.Cell;
                                    return d(
                                      'td',
                                      y(
                                        h(
                                          {
                                            className:
                                              'sm:flex-1 truncate w-1/2 sm:w-max pt-8 sm:pt-0 relative sm:flex-nowrap px-6 py-4 text-left',
                                          },
                                          b.getCellProps(),
                                        ),
                                        {
                                          style: {
                                            width: b.column.width,
                                            minWidth: b.column.minWidth,
                                            maxWidth: b.column.maxWidth,
                                          },
                                          role: 'cell',
                                          children: [
                                            t('span', {
                                              className:
                                                'group text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:hidden absolute top-0 inset-x-0 p-1 bg-gray-50 pl-2',
                                              children: b.column.Header,
                                            }),
                                            (w == null ? void 0 : w.name) ===
                                            'defaultRenderer'
                                              ? t('div', {
                                                  className:
                                                    'text-sm text-gray-500',
                                                  children: b.render('Cell'),
                                                })
                                              : b.render('Cell'),
                                          ],
                                        },
                                      ),
                                    );
                                  }),
                                },
                              ),
                            )
                          ),
                        ),
                      }),
                    ),
                  ],
                }),
              ),
            }),
          }),
        }),
      }),
      A &&
        d('div', {
          className: 'py-3 flex items-center justify-between',
          children: [
            d('div', {
              className: 'flex-1 flex justify-between sm:hidden',
              children: [
                t(ie, {
                  onClick: () => f(),
                  disabled: !s,
                  children: 'Previous',
                }),
                t(ie, { onClick: () => p(), disabled: !l, children: 'Next' }),
              ],
            }),
            d('div', {
              className:
                'hidden sm:flex-1 sm:flex sm:items-center sm:justify-between',
              children: [
                d('div', {
                  className: 'flex gap-x-2 items-baseline',
                  children: [
                    d('span', {
                      className: 'text-sm text-gray-700',
                      children: [
                        'Page ',
                        t('span', {
                          className: 'font-medium',
                          children: N.pageIndex + 1,
                        }),
                        ' ',
                        'of ',
                        t('span', {
                          className: 'font-medium',
                          children: u.length,
                        }),
                      ],
                    }),
                    d('label', {
                      htmlFor: 'itemsPerPage',
                      children: [
                        t('span', {
                          className: 'sr-only',
                          children: 'Items Per Page',
                        }),
                        t('select', {
                          id: 'itemsPerPage',
                          className:
                            'mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50',
                          value: N.pageSize,
                          onChange: (R) => {
                            x(Number(R.target.value));
                          },
                          children: [5, 10, 20].map((R) =>
                            d(
                              'option',
                              { value: R, children: ['Show ', R] },
                              R,
                            ),
                          ),
                        }),
                      ],
                    }),
                  ],
                }),
                t('div', {
                  children: d('nav', {
                    className:
                      'relative z-0 inline-flex rounded-md shadow-sm -space-x-px',
                    'aria-label': 'Pagination',
                    children: [
                      d(be, {
                        className: 'rounded-l-md',
                        onClick: () => v(0),
                        disabled: !s,
                        children: [
                          t('span', {
                            className: 'sr-only',
                            children: 'First',
                          }),
                          t(jr, {
                            className: 'h-5 w-5 text-gray-400',
                            'aria-hidden': 'true',
                          }),
                        ],
                      }),
                      d(be, {
                        onClick: () => f(),
                        disabled: !s,
                        children: [
                          t('span', {
                            className: 'sr-only',
                            children: 'Previous',
                          }),
                          t(Sr, {
                            className: 'h-5 w-5 text-gray-400',
                            'aria-hidden': 'true',
                          }),
                        ],
                      }),
                      d(be, {
                        onClick: () => p(),
                        disabled: !l,
                        children: [
                          t('span', { className: 'sr-only', children: 'Next' }),
                          t(it, {
                            className: 'h-5 w-5 text-gray-400',
                            'aria-hidden': 'true',
                          }),
                        ],
                      }),
                      d(be, {
                        className: 'rounded-r-md',
                        onClick: () => v(g - 1),
                        disabled: !l,
                        children: [
                          t('span', { className: 'sr-only', children: 'Last' }),
                          t(Ir, {
                            className: 'h-5 w-5 text-gray-400',
                            'aria-hidden': 'true',
                          }),
                        ],
                      }),
                    ],
                  }),
                }),
              ],
            }),
          ],
        }),
    ],
  });
}
function ja() {
  return dt({ cardId: Se().required(), parentId: Se(), text: Se().required() });
}
kr().oneOf([ye.Done, ye.Started, ye.Unstarted]);
function zt({ pdfString: e }) {
  const r = D.exports.useMemo(() => {
    const a = e && Yr(e);
    return a ? URL.createObjectURL(a) : null;
  }, [e]);
  return (
    D.exports.useEffect(
      () => () => {
        r && URL.revokeObjectURL(r);
      },
      [r],
    ),
    r ? t(ct.exports.Viewer, { fileUrl: r }) : t('p', { children: 'No Pdf' })
  );
}
function Sa({ isOpen: e, handleClose: r }) {
  var g;
  const a = G(),
    o = bt(h({}, Z(a))),
    { workflowProjectId: n } = H(),
    i = He().data || [],
    c = i.map((v) => ({ label: v.name, value: v.id })),
    m = re();
  D.exports.useEffect(() => {
    c.length > 0 && m.setValue('workflowState', c[0]);
  }, [c]);
  const s = (v) => {
      var I, j;
      if (!i.length) {
        Q.error('No workflowStates to add card to');
        return;
      }
      r();
      const p = `card-${Date.now()}`,
        C = v,
        { project: f, workflowState: x } = C,
        N = te(C, ['project', 'workflowState']);
      Q.promise(
        o.mutateAsync({
          cardId: p,
          workflowStateId: (x == null ? void 0 : x.value) || i[0].id,
          cardIds: [
            ...(((j =
              (I = i.find((A) => A.id === (x == null ? void 0 : x.value))) ==
              null
                ? void 0
                : I.cards) == null
              ? void 0
              : j.filter(M).map((A) => A.id)) || []),
            p,
          ],
          card: y(h({}, N.card), { projectId: f == null ? void 0 : f.value }),
        }),
        {
          pending: 'Creating card...',
          success: 'Card created!',
          error: 'Error creating card',
        },
      ),
        m.resetField('card');
    },
    l = Et(),
    u = (g = l.find((v) => v.value === n)) == null ? void 0 : g.label;
  return (
    D.exports.useEffect(() => {
      n && n && u && m.setValue('project', { label: u, value: n });
    }, [n, u]),
    t(Ne, {
      title: 'Add Card',
      formHooks: m,
      fields: [
        {
          id: 'CardState',
          label: 'Card State',
          rules: { required: !0 },
          options: c,
          path: 'workflowState',
          type: 'select',
        },
        {
          id: 'CardProject',
          type: 'select',
          options: l,
          label: 'Project',
          path: 'project',
        },
        {
          label: 'CV PDF',
          id: 'CVPDF',
          type: 'file',
          accept: 'application/pdf',
          multiple: !1,
          path: 'card.cvPdf',
        },
        {
          id: 'CardName',
          placeholder: 'Card Name',
          label: 'Name',
          type: 'text',
          rules: { required: !0 },
          path: 'card.title',
        },
        {
          id: 'CardDescription',
          label: 'Description',
          placeholder: 'Card Description',
          type: 'tiptap',
          path: 'card.description',
        },
        {
          label: 'Files',
          accept: 'image/jpeg, image/png, image/gif, application/pdf',
          id: 'CardFiles',
          type: 'multifile',
          path: 'card.files',
        },
      ],
      onSubmit: m.handleSubmit(s, console.warn),
      isOpen: e,
      handleClose: r,
    })
  );
}
function Ia({ handleClose: e }) {
  var f;
  const { modalState: r } = H(),
    a = r == null ? void 0 : r.cardId,
    o = G(),
    n = Rt({
      onSuccess: (x) => {
        var C;
        const N = (C = x.updateHiringCard) == null ? void 0 : C.id;
        N && o.refetchQueries(_.getKey({ ids: [N] }));
      },
    }),
    i = Ae(h({}, Z(o))),
    c = He().data || [],
    m = c.map((x) => ({ label: x.name, value: x.id })),
    { card: s } = We(a),
    l = (x) => {
      var E;
      e();
      const B = x,
        { workflowState: N, project: C } = B,
        I = te(B, ['workflowState', 'project']),
        j = {
          card: y(h({}, I.card), { projectId: C == null ? void 0 : C.value }),
          cardId: x.cardId,
        },
        A = c.find((R) => R.id === (N == null ? void 0 : N.value));
      s &&
        !le.isEqual(j.card, s) &&
        n.mutate({ card: j.card, cardId: x.cardId }),
        A &&
          A.id !==
            ((E = s == null ? void 0 : s.workflowState) == null
              ? void 0
              : E.id) &&
          i.mutate({
            workflowStateId: A.id,
            cardId: x.cardId,
            previousCard: 'end',
          });
    },
    u = re({ defaultValues: { card: s, cardId: s == null ? void 0 : s.id } }),
    g = async () => {
      var C;
      if (!s) return;
      const x =
          (C = s.files) == null
            ? void 0
            : C.filter(M).map(async (I) => {
                const j = I.name.startsWith('image') && I.base64;
                return y(h({}, I), { preview: j });
              }),
        N = x && (await Promise.all(x));
      u.setValue('card.files', N);
    };
  D.exports.useEffect(() => {
    var x, N, C, I, j;
    if (s) {
      u.setValue('workflowState', {
        label:
          ((x = s == null ? void 0 : s.workflowState) == null
            ? void 0
            : x.name) || 'Select a state',
        value:
          ((N = s == null ? void 0 : s.workflowState) == null
            ? void 0
            : N.id) || '',
      });
      const A = (C = s == null ? void 0 : s.project) == null ? void 0 : C.id;
      u.setValue('card', h({}, s)),
        (s == null ? void 0 : s.files) && g(),
        u.setValue('card.cvPdf', s == null ? void 0 : s.cvPdf),
        ((I = s.project) == null ? void 0 : I.name) &&
          A &&
          u.setValue('project', {
            label: (j = s.project) == null ? void 0 : j.name,
            value: A,
          });
    }
  }, [s]);
  const v = (s == null ? void 0 : s.title)
      ? `${s.title}: ${(f = s.workflowState) == null ? void 0 : f.name}`
      : 'Update Card',
    p = Et();
  return d('div', {
    className: 'relative h-full overflow-y-auto',
    children: [
      t(Be, {
        title: v,
        formHooks: u,
        fields: [
          {
            id: 'CardName',
            placeholder: 'Card Name',
            type: 'text',
            rules: { required: !0 },
            path: 'card.title',
            label: 'Name',
          },
          {
            id: 'CardProject',
            type: 'select',
            rules: {
              required: { value: !0, message: 'Please select a project' },
            },
            options: p,
            label: 'Project',
            path: 'project',
          },
          {
            id: 'CardState',
            label: 'Card State',
            rules: { required: !0 },
            options: m,
            path: 'workflowState',
            type: 'select',
          },
          {
            label: 'CV PDF',
            id: 'CVPDF',
            type: 'file',
            accept: 'application/pdf',
            multiple: !1,
            path: 'card.cvPdf',
          },
          {
            label: 'Description',
            id: 'CardDescription',
            placeholder: 'Card Description',
            type: 'tiptap',
            path: 'card.description',
          },
          {
            label: 'Other Files (optional)',
            accept: 'image/jpeg, image/png, image/gif, application/pdf',
            id: 'CardFiles',
            type: 'multifile',
            path: 'card.files',
          },
        ],
        onSubmit: u.handleSubmit(l, console.warn),
      }),
      d('div', {
        className: 'bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse',
        children: [
          t('button', {
            type: 'submit',
            form: v,
            className:
              'w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm',
            children: 'Submit',
          }),
          t('button', {
            type: 'button',
            className:
              'mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm',
            onClick: e,
            children: 'Cancel',
          }),
        ],
      }),
      t('div', {
        className: 'absolute top-7 sm:top-5 right-4',
        children: t($e, {
          options: [
            {
              label: 'Archive',
              id: 'archive',
              Icon: pa,
              ActiveIcon: ha,
              props: {
                onClick: () => {
                  e(),
                    (s == null ? void 0 : s.id) &&
                      Q.promise(
                        n.mutateAsync({
                          cardId: s.id,
                          card: y(h({}, s), { projectId: null }),
                        }),
                        {
                          pending: 'Archiving card...',
                          success: 'Card archived!',
                          error: 'Error archiving card',
                        },
                      );
                },
              },
            },
          ],
        }),
      }),
    ],
  });
}
function ka({ cardId: e }) {
  var p;
  const { data: r } = ta(e),
    a = G(),
    o = {
      onSettled: () => {
        a.refetchQueries(he.getKey({ id: e }));
      },
    },
    n = vt(o),
    i = It(o),
    c = (f) => {
      Q.promise(
        n.mutateAsync({ Comment: y(h({}, f.Comment), { cardId: e }) }),
        {
          pending: 'Adding comment...',
          success: 'Comment added!',
          error: 'Error adding comment',
        },
        { autoClose: 500 },
      );
    },
    m = dt({ Comment: ja() }),
    s = re({ resolver: Pr(m), defaultValues: { Comment: { cardId: e } } }),
    l = (f) => {
      s.handleSubmit(c, console.warn)(f), s.reset();
    },
    u = { formHooks: s, cardId: e, onSubmit: l },
    g = (p = s.formState.errors.Comment) == null ? void 0 : p.text;
  D.exports.useEffect(() => {
    const f = (x) => {
      (x.code === 'Enter' || x.code === 'NumpadEnter') &&
        (x.ctrlKey || x.metaKey) &&
        l();
    };
    return (
      document.addEventListener('keydown', f),
      () => {
        document.removeEventListener('keydown', f);
      }
    );
  }, []);
  const v = (f) => 'https://avatars.githubusercontent.com/u/9809256?v=4';
  return t('section', {
    'aria-labelledby': 'activity-title',
    className: 'sm:h-full',
    children: d('div', {
      className: 'divide-y divide-gray-200 pr-2',
      children: [
        t('div', {
          className: 'pb-4',
          children: t('h2', {
            id: 'activity-title',
            className: 'text-lg font-medium text-gray-900',
            children: 'Activity',
          }),
        }),
        d('div', {
          className: 'pt-6',
          children: [
            t('div', {
              className: 'flow-root h-full',
              children: t('ul', {
                className: '-mb-8',
                children:
                  r &&
                  le
                    .sortBy(r, (f) => f._siteValidTime)
                    .map((f, x) =>
                      t(
                        'li',
                        {
                          className: 'text-left',
                          children: d('div', {
                            className: 'relative pb-8',
                            children: [
                              x !== r.length - 1
                                ? t('span', {
                                    className:
                                      'absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200',
                                    'aria-hidden': 'true',
                                  })
                                : null,
                              d('div', {
                                className:
                                  'relative flex items-start space-x-3',
                                children: [
                                  d('div', {
                                    className: 'relative',
                                    children: [
                                      t('img', {
                                        className:
                                          'h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white',
                                        src: v(),
                                        alt: '',
                                      }),
                                      t('span', {
                                        className:
                                          'absolute -bottom-0.5 -right-1 bg-white rounded-tl px-0.5 py-px',
                                        children: t(Ye, {
                                          className: 'h-5 w-5 text-gray-400',
                                          'aria-hidden': 'true',
                                        }),
                                      }),
                                    ],
                                  }),
                                  d('div', {
                                    className: 'min-w-0 flex-1',
                                    children: [
                                      d('div', {
                                        children: [
                                          d('div', {
                                            className:
                                              'text-sm flex flex-row justify-between',
                                            children: [
                                              t('button', {
                                                type: 'button',
                                                className:
                                                  'font-medium text-gray-900',
                                                children:
                                                  (f == null
                                                    ? void 0
                                                    : f._siteSubject) || 'alx',
                                              }),
                                              t($e, {
                                                options: [
                                                  {
                                                    label: 'Delete',
                                                    id: 'delete',
                                                    Icon: Vt,
                                                    ActiveIcon: qt,
                                                    props: {
                                                      onClick: () => {
                                                        Q.promise(
                                                          i.mutateAsync({
                                                            commentId: f.id,
                                                          }),
                                                          {
                                                            pending:
                                                              'Deleting comment...',
                                                            success:
                                                              'Comment deleted!',
                                                            error:
                                                              'Error deleting comment',
                                                          },
                                                          { autoClose: 1e3 },
                                                        );
                                                      },
                                                    },
                                                  },
                                                ],
                                              }),
                                            ],
                                          }),
                                          d('p', {
                                            className:
                                              'mt-0.5 text-sm text-gray-500',
                                            children: [
                                              'Commented ',
                                              f._siteValidTime,
                                            ],
                                          }),
                                        ],
                                      }),
                                      t('div', {
                                        className: 'mt-2 text-sm text-gray-700',
                                        children: t('p', { children: f.text }),
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          }),
                        },
                        f.id,
                      ),
                    ),
              }),
            }),
            t('div', {
              className: 'mt-10',
              children: d('div', {
                className: 'flex space-x-3',
                children: [
                  t('div', {
                    className: 'flex-shrink-0',
                    children: d('div', {
                      className: 'relative',
                      children: [
                        t('img', {
                          className:
                            'h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white',
                          src: v(),
                          alt: '',
                        }),
                        t('span', {
                          className:
                            'absolute -bottom-0.5 -right-1 bg-white rounded-tl px-0.5 py-px',
                          children: t(Ye, {
                            className: 'h-5 w-5 text-gray-400',
                            'aria-hidden': 'true',
                          }),
                        }),
                      ],
                    }),
                  }),
                  t('div', {
                    className: 'min-w-0 flex-1',
                    children: d('form', {
                      onSubmit: u.onSubmit,
                      children: [
                        d('div', {
                          children: [
                            t('label', {
                              htmlFor: 'comment',
                              className: 'sr-only',
                              children: 'Comment',
                            }),
                            t(Pe, {
                              field: {
                                id: 'commentText',
                                path: 'Comment.text',
                                placeholder:
                                  'Type a comment (ctrl+enter to send)',
                                type: 'textarea',
                              },
                              props: u,
                            }),
                            t(xa, { error: g }),
                          ],
                        }),
                        t('div', {
                          className:
                            'my-6 flex items-center justify-end space-x-4',
                          children: t('button', {
                            type: 'submit',
                            className:
                              'inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gray-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900',
                            children: 'Comment',
                          }),
                        }),
                      ],
                    }),
                  }),
                ],
              }),
            }),
          ],
        }),
      ],
    }),
  });
}
function Da({ handleClose: e, show: r }) {
  const [a, o] = D.exports.useState(1),
    n = [
      {
        id: 'q-1',
        question:
          'Tell me about a time where your communication with others helped you build rapport or create better relationships and outcomes?',
        lookingFor: [
          'How did they learn about the other person?',
          'Were their exchanges based on respect, or simply getting an outcome?',
          ' Did they continue the effort? Did they only do so to get a result, or do they show a pattern of always working at relationships?',
        ],
        weak: [
          'Only interested in other person for potential outcome',
          'Does not consistently build relationships',
          'Only calls when they want something',
          'Cannot demonstrate clear business benefit',
        ],
        strong: [
          'Creates strategy for building relationships',
          'Articulates benefit of wide ranging relationships',
          'Gives before getting',
          'Maintains relationships without near term business gain',
        ],
      },
      {
        id: 'q-2',
        question:
          'Tell me about an effective relationship you have created and kept over a long period. How did you achieve that?',
        lookingFor: [
          'What do they describe as "long"?',
          'What actions did they take to keep the relationship active?',
          'Was there reciprocity \u2013 a willingness to share as well as benefit?',
          'What different forms of communication do they use?',
          'How do they communicate in ways that are helpful to the other person?',
        ],
        weak: [
          'Long is less than 1-2 years',
          'Relies on other person to make contact',
          'Does not offer to give before getting',
          'Communicates in a limited way',
          'Has only internal relationships',
        ],
        strong: [
          'Has a strategy for maintaining relationship',
          'Gives without prospect of getting',
          'Communicates in multiple ways',
          'Has relationships in different companies/industries',
          'Demonstrates different communication styles',
        ],
      },
    ],
    [i, c] = D.exports.useState(
      Object.fromEntries(n.map(({ id: p }) => [p, void 0])),
    ),
    m = n[a - 1],
    s = [
      { value: 0, label: '\u{1F4A9}' },
      { value: 25, label: '\u{1F615}' },
      { value: 50, label: '\u{1F937}\u200D\u2640\uFE0F' },
      { value: 75, label: '\u{1F44C}' },
      { value: 100, label: '\u{1F60E}' },
    ],
    l = D.exports.useRef(null),
    u = () => {
      var p;
      (p = l.current) == null || p.scrollTo({ top: 0, behavior: 'smooth' });
    },
    g = () => {
      o((p) => p + 1), u();
    },
    v = () => {
      o((p) => p - 1), u();
    };
  return (
    D.exports.useEffect(() => {
      setTimeout(() => {
        var p;
        return (p = l.current) == null ? void 0 : p.scrollTo({ top: 0 });
      }, 50);
    }, [r]),
    d(we, {
      className: 'h-screen-80',
      isOpen: r,
      handleClose: e,
      children: [
        t('div', {
          ref: l,
          className: 'relative py-16 bg-white overflow-auto',
          children: d('div', {
            className: 'relative px-4 sm:px-6 lg:px-8',
            children: [
              d('div', {
                className: 'text-lg max-w-prose mx-auto',
                children: [
                  d('h1', {
                    children: [
                      t('span', {
                        className:
                          'block text-base text-center text-indigo-600 font-semibold tracking-wide uppercase',
                        children: 'Interview 1',
                      }),
                      d('span', {
                        className:
                          'mt-2 block text-3xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl',
                        children: ['Question ', a],
                      }),
                    ],
                  }),
                  t('div', {
                    className: 'bg-indigo-700 rounded-lg',
                    children: t('div', {
                      className:
                        'text-center mt-4 py-4 px-4 sm:py-8 sm:px-6 lg:px-8',
                      children: t('p', {
                        className: 'text-xl leading-6 text-indigo-50',
                        children: m.question,
                      }),
                    }),
                  }),
                ],
              }),
              d('div', {
                className:
                  'mt-6 prose prose-indigo prose-lg text-gray-500 mx-auto',
                children: [
                  t('h2', { children: 'Behaviours to look for:' }),
                  t('ul', {
                    children: m.lookingFor.map((p) =>
                      t('li', { children: p }, p),
                    ),
                  }),
                  d('div', {
                    className: 'flex space-x-4',
                    children: [
                      d('div', {
                        children: [
                          t('h2', { children: 'Weak' }),
                          t('ul', {
                            children: m.weak.map((p) =>
                              t('li', { children: p }, p),
                            ),
                          }),
                        ],
                      }),
                      d('div', {
                        children: [
                          t('h2', { children: 'Strong' }),
                          t('ul', {
                            children: m.strong.map((p) =>
                              t('li', { children: p }, p),
                            ),
                          }),
                        ],
                      }),
                    ],
                  }),
                  t('div', {
                    className: 'flex flex-col items-center',
                    children: d('div', {
                      className: 'w-full',
                      children: [
                        t('h2', { children: 'Score:' }),
                        t(
                          Mr,
                          {
                            value: i[m.id] || 0,
                            onChange: (p) => {
                              c(y(h({}, i), { [m.id]: p }));
                            },
                            labelTransition: 'skew-down',
                            labelTransitionDuration: 150,
                            labelTransitionTimingFunction: 'ease',
                            label: (p) => {
                              var f;
                              return (f = s.find((x) => x.value === p)) == null
                                ? void 0
                                : f.label;
                            },
                            defaultValue: 50,
                            step: 25,
                            marks: [
                              { value: 0, label: 'Weak' },
                              { value: 100, label: 'Strong' },
                            ],
                          },
                          `slider-${a}`,
                        ),
                        t('h2', { children: 'What was said:' }),
                        t('div', {
                          className: 'flex justify-center',
                          children: t(
                            Lt,
                            {
                              onChange: () => null,
                              withTaskListExtension: !0,
                              withLinkExtension: !0,
                              withTypographyExtension: !0,
                              withPlaceholderExtension: !0,
                              withMentionSuggestion: !0,
                            },
                            `tiptap-${a}`,
                          ),
                        }),
                      ],
                    }),
                  }),
                ],
              }),
            ],
          }),
        }),
        d('nav', {
          className:
            'bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6',
          'aria-label': 'Pagination',
          children: [
            t('div', {
              className: 'hidden sm:block',
              children: d('p', {
                className: 'text-sm text-gray-700',
                children: [
                  'Question ',
                  t('span', { className: 'font-medium', children: a }),
                  ' of',
                  ' ',
                  t('span', { className: 'font-medium', children: n.length }),
                ],
              }),
            }),
            d('div', {
              className: 'flex-1 flex justify-between sm:justify-end',
              children: [
                t(ie, {
                  onClick: () => {
                    var p;
                    (p = l.current) == null ||
                      p.scrollTo({ top: 0, behavior: 'smooth' }),
                      v();
                  },
                  disabled: a === 1,
                  className: 'mr-2',
                  children: 'Previous',
                }),
                a === n.length
                  ? t(ie, { primary: !0, onClick: g, children: 'Submit' })
                  : t(ie, {
                      className:
                        'relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50',
                      onClick: g,
                      children: 'Next',
                    }),
              ],
            }),
          ],
        }),
      ],
    })
  );
}
function at(e) {
  return t(lt, {
    className: T('w-4 h-4', e ? 'transform rotate-180 text-primary-500' : ''),
  });
}
function ot({ card: e, resetSplit: r }) {
  var s;
  const [a, o] = D.exports.useState(!1),
    [n, i] = D.exports.useState(
      parseInt(localStorage.getItem('hsplitPos') || '700', 10),
    );
  mt(
    (l) => {
      l && localStorage.setItem('hsplitPos', l.toString());
    },
    500,
    [n],
  );
  const m = T(
    'flex items-center justify-between w-full px-4 py-2 my-2 rounded-base cursor-base focus:outline-none',
    'bg-orange-50 rounded-lg text-primary-800 dark:bg-primary-200 dark:bg-opacity-15 dark:text-primary-200',
  );
  return d(J, {
    children: [
      t(Da, { show: a, handleClose: () => o(!1) }),
      d('div', {
        className: 'h-full rounded',
        children: [
          r &&
            t('button', {
              type: 'button',
              className:
                'lg:hidden absolute top-0 z-20 bg-white left-0 mr-4 mt-4 cursor-pointer',
              onClick: r,
              children: 'Reset Split',
            }),
          d(ut, {
            onChange: i,
            style: { overflowY: 'auto' },
            split: 'horizontal',
            defaultSize: n,
            children: [
              d('div', {
                className:
                  'text-center mx-4 flex flex-col w-full items-center justify-center isolate',
                children: [
                  t('h2', {
                    className:
                      'text-3xl font-extrabold text-gray-900 sm:text-4xl',
                    children: e.title,
                  }),
                  t('p', { children: e.id }),
                  ((s = e == null ? void 0 : e.project) == null
                    ? void 0
                    : s.name) &&
                    d('p', { children: ['Project: ', e.project.name] }),
                  d('p', {
                    className: 'text-gray-500',
                    children: ['Last Updated ', e._siteValidTime],
                  }),
                  (e == null ? void 0 : e._siteSubject) &&
                    d('p', {
                      className: 'text-gray-500',
                      children: ['By: ', e._siteSubject],
                    }),
                  (e == null ? void 0 : e.workflowState) &&
                    d('p', {
                      className: 'text-gray-500',
                      children: ['Status: ', e.workflowState.name],
                    }),
                  (e == null ? void 0 : e.description) &&
                    t('div', {
                      className:
                        'ProseMirror prose text-left bg-white shadow-lg w-full no-scrollbar h-full mb-4',
                      dangerouslySetInnerHTML: {
                        __html: pt.sanitize(
                          (e == null ? void 0 : e.description) || '',
                        ),
                      },
                    }),
                ],
              }),
              d('div', {
                className:
                  'max-w-4xl overflow-y-auto lg:overflow-y-hidden h-full mx-auto text-center flex flex-wrap lg:flex-nowrap items-center lg:items-baseline',
                children: [
                  d('div', {
                    className: 'w-full lg:h-full lg:overflow-y-auto m-4',
                    children: [
                      t(ne, {
                        defaultOpen: !0,
                        as: 'div',
                        className: 'mt-2 w-full',
                        children: ({ open: l }) =>
                          d(J, {
                            children: [
                              d(ne.Button, {
                                className: m,
                                children: [
                                  t('span', { children: 'Interview 1' }),
                                  at(l),
                                ],
                              }),
                              t(ne.Panel, {
                                className: 'px-4 pt-4 pb-2 text-sm text-muted',
                                children: d('div', {
                                  className:
                                    'mt-2 flex justify-between items-center',
                                  children: [
                                    'Status: Booked for 03/02/22 at 4pm',
                                    t(ie, {
                                      onClick: () => o(!0),
                                      children: 'Start',
                                    }),
                                  ],
                                }),
                              }),
                            ],
                          }),
                      }),
                      (e == null ? void 0 : e.files) &&
                        (e == null ? void 0 : e.files.length) > 0 &&
                        t(ne, {
                          as: 'div',
                          className: 'mt-2 w-full',
                          children: ({ open: l }) =>
                            d(J, {
                              children: [
                                d(ne.Button, {
                                  className: m,
                                  children: [
                                    t('span', { children: 'Other Files' }),
                                    at(l),
                                  ],
                                }),
                                t(ne.Panel, {
                                  className:
                                    'px-4 pt-4 pb-2 text-sm text-muted',
                                  children:
                                    (e == null ? void 0 : e.files) &&
                                    t('div', {
                                      className: 'mt-2 flex justify-between',
                                      children: e.files
                                        .filter(M)
                                        .map((u) =>
                                          t(
                                            'div',
                                            {
                                              className: 'flex items-center',
                                              children: t(De, { file: u }),
                                            },
                                            u.name,
                                          ),
                                        ),
                                    }),
                                }),
                              ],
                            }),
                        }),
                    ],
                  }),
                  t('div', {
                    className: 'w-full px-4 sm:h-full lg:overflow-y-auto',
                    children: t(ka, { cardId: e.id }),
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
function Pa() {
  var p, f, x;
  const e = (p = H().modalState) == null ? void 0 : p.cardId,
    { data: r, isLoading: a } = We(e),
    o = (f = r == null ? void 0 : r.cardsByIds) == null ? void 0 : f[0],
    i = Bt().isMobile(),
    [c, m] = D.exports.useState(
      parseInt(localStorage.getItem('vsplitPos') || '900', 10),
    ),
    [s, l] = D.exports.useState(c);
  mt(
    (N) => {
      N && localStorage.setItem('vsplitPos', N.toString());
    },
    500,
    [c],
  );
  const g = () => {
      m(400), l(c), localStorage.removeItem('vsplitPos');
    },
    v = (x = o == null ? void 0 : o.cvPdf) == null ? void 0 : x.base64;
  return t('div', {
    className: 'relative h-full',
    children: t('div', {
      className:
        'flex h-full flex-col lg:flex-row justify-around items-center lg:items-start ',
      children: i
        ? t('div', {
            className: 'w-full h-full overflow-y-scroll',
            children: o && t(ot, { card: o }),
          })
        : d(
            ut,
            {
              pane2Style: { overflowY: 'auto' },
              paneStyle: { height: '100%' },
              split: 'vertical',
              defaultSize: c,
              onChange: m,
              children: [
                a &&
                  t('div', {
                    className:
                      'flex flex-col justify-center items-center h-full',
                    children: t('div', {
                      className: 'text-center',
                      children: t('h1', {
                        className: 'text-3xl font-extrabold text-gray-900',
                        children: 'Loading Card Details...',
                      }),
                    }),
                  }),
                o && t(ot, { resetSplit: c > 400 ? g : void 0, card: o }),
                !o &&
                  t('div', {
                    className:
                      'flex flex-col justify-center items-center h-full',
                    children: t('h1', {
                      className: 'text-3xl font-extrabold text-gray-900',
                      children: 'No Card Found',
                    }),
                  }),
                t('div', {
                  children: v
                    ? t('div', {
                        className: 'max-w-3xl block overflow-y-auto',
                        children: t(zt, { pdfString: v }, c),
                      })
                    : t('div', {
                        className: 'text-center',
                        children: t('h1', {
                          className: 'text-3xl font-extrabold text-gray-900',
                          children: 'No CV found',
                        }),
                      }),
                }),
              ],
            },
            s,
          ),
    }),
  });
}
function Ma({ value: e }) {
  return t('div', { className: 'text-sm truncate', children: e || 'Untitled' });
}
function Ra() {
  var s;
  const e = (s = H().modalState) == null ? void 0 : s.cardId,
    { history: r } = ra(e),
    a = G(),
    o = Pt({
      onSettled: (l) => {
        var g;
        const u =
          ((g = l == null ? void 0 : l.rollbackCard) == null ? void 0 : g.id) ||
          '';
        a.refetchQueries(_.getKey({ ids: [u] })),
          a.refetchQueries(K.getKey()),
          a.refetchQueries(pe.getKey({ id: u }));
      },
    }),
    n = async (l) => {
      Q.promise(o.mutateAsync({ id: l.id, asOf: l._siteValidTime }), {
        success: 'Card rolled back successfully',
        error: 'Card rollback failed',
        pending: 'Rolling back card...',
      });
    };
  function i({ row: l }) {
    return t('button', {
      type: 'button',
      className:
        'inline-flex justify-center items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
      onClick: () => n(l.original),
      children: 'Rollback',
    });
  }
  const c = D.exports.useMemo(
      () =>
        r == null
          ? void 0
          : r.filter(M).map((l, u) => {
              var C, I, j, A, B, E, R, b, w, S, k;
              const g =
                  r[u + 1] &&
                  ((C = r[u + 1]) == null ? void 0 : C.description) !==
                    (l == null ? void 0 : l.description),
                v =
                  r[u + 1] &&
                  ((j = (I = r[u + 1]) == null ? void 0 : I.project) == null
                    ? void 0
                    : j.name) !==
                    ((A = l == null ? void 0 : l.project) == null
                      ? void 0
                      : A.name),
                p =
                  r[u + 1] &&
                  ((E = (B = r[u + 1]) == null ? void 0 : B.cvPdf) == null
                    ? void 0
                    : E.name) !==
                    ((R = l == null ? void 0 : l.cvPdf) == null
                      ? void 0
                      : R.name),
                f =
                  r[u + 1] &&
                  ((w = (b = r[u + 1]) == null ? void 0 : b.files) == null
                    ? void 0
                    : w
                        .map((W) => (W == null ? void 0 : W.name))
                        .toString()) !==
                    ((S = l == null ? void 0 : l.files) == null
                      ? void 0
                      : S.map((W) => (W == null ? void 0 : W.name)).toString()),
                x =
                  r[u + 1] &&
                  ((k = r[u + 1]) == null ? void 0 : k.title) !==
                    (l == null ? void 0 : l.title),
                N = !x && !g && !v && !p && !f;
              return y(h({}, l), {
                nothingChanged: N,
                hasDescriptionChanged: g,
                projectChanged: v,
                cvChanged: p,
                filesChanged: f,
                titleChanged: x,
                diff: [
                  x && 'Title changed',
                  g && 'description changed',
                  v && 'project changed',
                  p && 'cv changed',
                  f && 'files changed',
                ]
                  .filter((W) => W)
                  .join(', '),
              });
            }),
      [r],
    ),
    m = D.exports.useMemo(
      () => [
        { Header: 'Diff', accessor: 'diff' },
        { Header: 'Title', accessor: 'title', Cell: Ma },
        { Header: 'Project', accessor: 'project.name' },
        { Header: 'Edited By', accessor: '_siteSubject' },
        { Header: 'Updated at', accessor: '_siteValidTime' },
        { Header: 'Actions', Cell: i },
      ],
      [],
    );
  return t('div', {
    className: 'relative h-full',
    children: r
      ? t('div', {
          className:
            'flex flex-col lg:flex-row justify-around items-center lg:items-start h-full',
          children: d('div', {
            className:
              'flex flex-col h-full w-full overflow-x-auto lg:w-fit lg:overflow-x-hidden px-4 relative',
            children: [
              t('div', {
                className: 'text-center',
                children: t('h1', {
                  className: 'text-3xl font-extrabold text-gray-900',
                  children: 'Card History',
                }),
              }),
              t(Ut, { columns: m, data: c }),
            ],
          }),
        })
      : t('div', {
          className:
            'flex flex-col lg:flex-row justify-around items-center lg:items-start h-screen',
          children: t('div', {
            className: 'flex flex-col justify-center items-center h-full',
            children: t('div', {
              className: 'text-center',
              children: t('h1', {
                className: 'text-3xl font-extrabold text-gray-900',
                children: 'Loading Card History...',
              }),
            }),
          }),
        }),
  });
}
function Fa({ isOpen: e, handleClose: r }) {
  var v, p, f;
  const g = H(),
    { cardModalView: a } = g,
    o = te(g, ['cardModalView']),
    n = (v = H().modalState) == null ? void 0 : v.cardId,
    { data: i, error: c } = We(n),
    m = ee(),
    s = (p = i == null ? void 0 : i.cardsByIds) == null ? void 0 : p[0],
    l = (f = s == null ? void 0 : s.cvPdf) == null ? void 0 : f.base64,
    u = () => {
      r(),
        a !== 'view' &&
          setTimeout(() => {
            m({
              search: y(h({}, o), {
                modalState: void 0,
                cardModalView: void 0,
              }),
            });
          }, 400);
    };
  return d(we, {
    isOpen: e,
    handleClose: u,
    fullWidth: a !== 'update',
    noScroll: !0,
    children: [
      d('div', {
        className: 'fixed w-full top-0 z-10 bg-white',
        children: [
          t(oa, {
            tabs: [
              { id: 'view', name: 'View', default: !a },
              { id: 'cv', name: 'CV', hidden: !l },
              { id: 'update', name: 'Edit' },
              { id: 'history', name: 'History' },
            ],
            navName: 'cardModalView',
          }),
          t('div', {
            className: 'absolute top-3 right-3 w-5 h-5 cursor-pointer',
            children: t(Dr, { onClick: u }),
          }),
        ],
      }),
      d('div', {
        className: 'h-full',
        style: { paddingTop: '54px' },
        children: [
          c &&
            d('div', {
              className: 'flex flex-col justify-center items-center h-full',
              children: [
                t('div', {
                  className: 'text-center',
                  children: t('h1', {
                    className: 'text-3xl font-extrabold text-gray-900',
                    children: 'Error Loading Card',
                  }),
                }),
                t('div', {
                  className: 'text-center',
                  children: t('p', {
                    className: 'text-gray-700',
                    children: c.message,
                  }),
                }),
              ],
            }),
          (!a || a === 'view') && t(Pa, {}),
          a === 'update' && t(Ia, { handleClose: u }),
          a === 'history' && t(Ra, {}),
          a === 'cv' &&
            t('div', {
              className: 'block mx-auto max-w-xl h-full min-h-full ',
              children: t(zt, { pdfString: l }),
            }),
        ],
      }),
    ],
  });
}
const Ta = $.memo(({ card: e, index: r, workflow: a }) => {
    var s, l, u, g, v;
    const [, o] = U({
        formModalType: 'editCard',
        cardId: e.id,
        workflowId: a == null ? void 0 : a.id,
        workflowStateId:
          (s =
            a == null
              ? void 0
              : a.workflowStates.find((p) => {
                  var f;
                  return (f = p == null ? void 0 : p.cards) == null
                    ? void 0
                    : f.find((x) => (x == null ? void 0 : x.id) === e.id);
                })) == null
            ? void 0
            : s.id,
      }),
      { data: n } = _(
        { ids: [e.id] },
        {
          enabled: !1,
          select: (p) => {
            var f;
            return (f = p == null ? void 0 : p.cardsByIds) == null
              ? void 0
              : f.filter(M)[0];
          },
        },
      ),
      i = H(),
      m = (i == null ? void 0 : i.showDetails) && {
        imageSrc:
          (v =
            (g =
              (u =
                (l = n == null ? void 0 : n.files) == null
                  ? void 0
                  : l.filter((p) =>
                      p == null ? void 0 : p.type.startsWith('image'),
                    )) == null
                ? void 0
                : u[0]) == null
              ? void 0
              : g.base64) != null
            ? v
            : '',
        descriptionHtml:
          (n == null ? void 0 : n.description) &&
          (n == null ? void 0 : n.description) !== '<p></p>' &&
          pt.sanitize(n == null ? void 0 : n.description),
      };
    return t(Rr, {
      draggableId: e.id,
      index: r,
      children: (p, f) => {
        const x = f.isDragging && !f.isDropAnimating,
          N = T(
            'text-left bg-white w-full sm:w-52 lg:w-64 rounded border-2 mb-2 p-2 border-gray-500 hover:border-blue-400',
            x && 'bg-blue-50 border-blue-400 shadow-lg',
            !(e == null ? void 0 : e.project) && 'border-red-500 bg-red-50',
          );
        return t(gt, {
          style: p.draggableProps.style,
          snapshot: f,
          children: (C) => {
            var I;
            return d(
              'div',
              y(h(h({}, p.draggableProps), p.dragHandleProps), {
                style: C,
                className: N,
                onKeyPress: (j) => {
                  j.key === 'Enter' && o(!0);
                },
                onClick: () => (a == null ? void 0 : a.id) && o(!0),
                ref: p.innerRef,
                children: [
                  (i == null ? void 0 : i.devMode) &&
                    t('pre', { className: 'truncate', children: e.id }),
                  t('p', {
                    className:
                      'uppercase text-gray-800 font-extralight text-sm',
                    children: (I = e.project) == null ? void 0 : I.name,
                  }),
                  t('p', { className: 'prose lg:prose-xl', children: e.title }),
                  m &&
                    m.descriptionHtml &&
                    t('div', {
                      className:
                        'ProseMirror h-min max-h-32 w-full my-2 overflow-y-auto',
                      dangerouslySetInnerHTML: { __html: m.descriptionHtml },
                    }),
                  m &&
                    m.imageSrc &&
                    t('img', {
                      src: m.imageSrc,
                      width: 100,
                      height: 100,
                      className: 'rounded',
                      alt: 'Card',
                    }),
                ],
              }),
            );
          },
        });
      },
    });
  }),
  Aa = $.memo(
    ({ workflowState: e, cards: r, workflow: a, tooltipTarget: o }) => {
      var c, m;
      const n =
          ((m = (c = a.workflowStates) == null ? void 0 : c[0]) == null
            ? void 0
            : m.id) === e.id,
        [, i] = U({
          formModalType: 'editWorkflowState',
          workflowStateId: e.id,
        });
      return t(J, {
        children: t(ht, {
          droppableId: e.id,
          type: 'card',
          children: (s, l) =>
            d('div', {
              style: { borderColor: l.isDraggingOver ? 'gray' : 'transparent' },
              className: T(
                'transition sm:mx-1 border-4',
                n && 'sm:ml-0',
                l.isDraggingOver && 'bg-blue-50 shadow-sm  border-dashed ',
                ' flex flex-col ',
                r.length === 0 && 'relative h-36',
              ),
              children: [
                t('button', {
                  type: 'button',
                  onClick: () => (a == null ? void 0 : a.id) && i(!0),
                  className: T(
                    'prose cursor-pointer isolate',
                    r.length === 0 &&
                      !l.isDraggingOver &&
                      'sm:transition sm:rotate-90 sm:relative sm:top-2 sm:left-10 sm:origin-top-left sm:whitespace-nowrap',
                  ),
                  children:
                    r.length === 0 && !l.isDraggingOver
                      ? d(J, {
                          children: [
                            t('h3', {
                              className: 'text-white',
                              children: 'col',
                            }),
                            t('h3', {
                              className: 'absolute top-2',
                              children: e.name,
                            }),
                          ],
                        })
                      : t(ft, {
                          singleton: o,
                          delay: [100, 500],
                          content: d('div', {
                            className: 'text-sm',
                            children: [
                              d('p', { children: ['Column ID ', e.id] }),
                              t('p', {
                                children: e == null ? void 0 : e.description,
                              }),
                              d('p', {
                                children: [
                                  r.length,
                                  ' card',
                                  r.length === 1 ? '' : 's',
                                ],
                              }),
                              t('p', { children: 'Click to edit' }),
                            ],
                          }),
                          children: d('div', {
                            style: { marginBlock: '8px' },
                            className: 'flex items-center justify-between my-2',
                            children: [
                              t('h3', {
                                style: { marginBlock: 0 },
                                children: e.name,
                              }),
                              t('span', {
                                className:
                                  'px-2 bg-blue-50  text-gray-500 font-extralight rounded-md ',
                                children: r.length,
                              }),
                            ],
                          }),
                        }),
                }),
                d(
                  'div',
                  y(
                    h(
                      {
                        className:
                          'h-full juxt-kanban-cols-container overflow-scroll no-scrollbar',
                        ref: s.innerRef,
                      },
                      s.droppableProps,
                    ),
                    {
                      children: [
                        r.map((u, g) =>
                          t(Ta, { card: u, workflow: a, index: g }, u.id),
                        ),
                        s.placeholder,
                      ],
                    },
                  ),
                ),
              ],
            }),
        }),
      });
    },
  );
function Ha(e, r) {
  var a;
  return r
    ? (a =
        e == null
          ? void 0
          : e.filter((o) => {
              var n, i;
              return (
                (r === '' && (o == null ? void 0 : o.project)) ||
                (((n = o == null ? void 0 : o.project) == null
                  ? void 0
                  : n.name) &&
                  ((i = o.project) == null ? void 0 : i.id) === r)
              );
            })) != null
      ? a
      : []
    : e;
}
function Wa(e, r) {
  if (!e) return null;
  const a = (e == null ? void 0 : e.workflowStates.filter(M)) || [];
  return y(h({}, e), {
    workflowStates: a.map((o) => {
      var n;
      return y(h({}, o), {
        cards: Ha((n = o.cards) == null ? void 0 : n.filter(M), r),
      });
    }),
  });
}
function $a({ provided: e, isDragging: r, cols: a, workflow: o }) {
  const [n, i] = Ar();
  return d(
    'div',
    y(
      h(
        { className: 'flex sm:flex-row flex-col max-w-full' },
        e.droppableProps,
      ),
      {
        ref: e.innerRef,
        children: [
          t(ft, {
            singleton: n,
            delay: [500, 100],
            moveTransition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
          }),
          a.map((c) => {
            var m;
            return t(
              Aa,
              {
                tooltipTarget: i,
                isDragging: r,
                workflowState: c,
                cards:
                  ((m = c == null ? void 0 : c.cards) == null
                    ? void 0
                    : m.filter(M)) || [],
                workflow: o,
              },
              c.id,
            );
          }),
          e.placeholder,
        ],
      },
    ),
  );
}
function Ba({ workflow: e }) {
  var B, E, R;
  if (!(e == null ? void 0 : e.id)) return null;
  const r = H(),
    { workflowProjectId: a, devMode: o } = r,
    n = $.useMemo(() => Wa(e, a), [e, a]),
    [i, c] = $.useState(),
    m =
      (R =
        (E = (B = K()) == null ? void 0 : B.data) == null
          ? void 0
          : E.allWorkflows) == null
        ? void 0
        : R.find((b) => (b == null ? void 0 : b.id) === e.id);
  $.useEffect(() => {
    n && c(n);
  }, [n]);
  const s =
      (i == null
        ? void 0
        : i.workflowStates.filter(M).map((b) => {
            var w;
            return y(h({}, b), {
              cards:
                ((w = b.cards) == null
                  ? void 0
                  : w
                      .filter((S) => o || (S == null ? void 0 : S.project))
                      .filter(M)) || [],
            });
          })) || [],
    l = G(),
    u = Tt(h({}, Z(l))),
    g = Ae(h({}, Z(l))),
    v = $.useCallback(
      (b, w, S, k, W, L, V) => {
        var X, Y;
        if (w === S) {
          const fe =
            ((Y =
              (X =
                b == null
                  ? void 0
                  : b.workflowStates
                      .filter(M)
                      .find((ae) => ae.id === k.droppableId)) == null
                ? void 0
                : X.cards) == null
              ? void 0
              : Y.filter(M).map((ae) => ae.id)) || [];
          u.mutate({
            workflowStateId: w == null ? void 0 : w.id,
            cardIds: le.uniq(fe),
          });
        } else
          S &&
            g.mutate({
              workflowStateId: S == null ? void 0 : S.id,
              cardId: L,
              previousCard: V || 'start',
            });
      },
      [g],
    ),
    [, p] = U({ formModalType: 'addCard', workflowId: e.id });
  Fr('c', () => {
    p(!0);
  });
  const [f, x] = $.useState(!1),
    N = r.view === 'table',
    C = $.useMemo(
      () => [
        ...s
          .filter(M)
          .flatMap((b) => [
            ...b.cards.map((w) => y(h({}, w), { state: b.name })),
          ]),
      ],
      [s],
    ),
    I = $.useMemo(
      () => [
        {
          Header: 'id',
          accessor: 'id',
          width: 20,
          minWidth: 20,
          maxWidth: 150,
        },
        { id: 'name', Header: 'Name', accessor: 'title' },
        { id: 'state', Header: 'State', accessor: 'state', Filter: Ca },
        {
          id: 'lastUpdated',
          Header: 'Last Updated',
          accessor: '_siteValidTime',
        },
      ],
      [],
    ),
    j = ee();
  return d('div', {
    className: 'px-4 h-full-minus-nav',
    children: [
      t(na, { workflow: e, handleAddCard: () => p(!0) }),
      N &&
        t(Ut, {
          onRowClick: ({ values: b }) => {
            var S;
            const w = b.id;
            w &&
              j({
                replace: !0,
                search: y(h({}, r), {
                  modalState: {
                    cardId: w,
                    formModalType: 'editCard',
                    workflowId: e == null ? void 0 : e.id,
                    workflowStateId:
                      (S =
                        e == null
                          ? void 0
                          : e.workflowStates.find((k) => {
                              var W;
                              return (W = k == null ? void 0 : k.cards) == null
                                ? void 0
                                : W.find(
                                    (L) => (L == null ? void 0 : L.id) === w,
                                  );
                            })) == null
                        ? void 0
                        : S.id,
                  },
                }),
              });
          },
          data: C,
          columns: I,
        }),
      !N &&
        i &&
        t(Tr, {
          onDragStart: () => x(!0),
          onDragEnd: ({ destination: b, source: w, draggableId: S }) => {
            var X, Y, fe, ae, Ee, Oe, Le, Ve;
            if (
              (x(!1),
              !b || (b.droppableId === w.droppableId && b.index === w.index))
            )
              return;
            const k = et(i, w, b),
              W = s.find((O) => O.id === w.droppableId),
              L = s.find((O) => O.id === b.droppableId),
              V =
                b.index === 0
                  ? !1
                  : (fe =
                      (Y =
                        (X =
                          k == null
                            ? void 0
                            : k.workflowStates.find(
                                (O) =>
                                  (O == null ? void 0 : O.id) === b.droppableId,
                              )) == null
                          ? void 0
                          : X.cards) == null
                        ? void 0
                        : Y[b.index - 1]) == null
                  ? void 0
                  : fe.id;
            if (!(!W || !L)) {
              if (!a && k) v(k, W, L, w, b, S, V);
              else {
                const O =
                    m == null
                      ? void 0
                      : m.workflowStates.find(
                          (F) => (F == null ? void 0 : F.id) === w.droppableId,
                        ),
                  de =
                    m == null
                      ? void 0
                      : m.workflowStates.find(
                          (F) => (F == null ? void 0 : F.id) === b.droppableId,
                        ),
                  Kt =
                    ((ae = O == null ? void 0 : O.cards) == null
                      ? void 0
                      : ae.findIndex(
                          (F) => (F == null ? void 0 : F.id) === S,
                        )) || w.index,
                  oe =
                    k == null
                      ? void 0
                      : k.workflowStates.find(
                          (F) => (F == null ? void 0 : F.id) === b.droppableId,
                        ),
                  qe =
                    (Ee = oe == null ? void 0 : oe.cards) == null
                      ? void 0
                      : Ee.findIndex((F) => (F == null ? void 0 : F.id) === S),
                  _t =
                    ((Oe = oe == null ? void 0 : oe.cards) == null
                      ? void 0
                      : Oe.filter(M)) || [],
                  Qt =
                    b.index === 0
                      ? void 0
                      : !!qe && ((Le = _t[qe - 1]) == null ? void 0 : Le.id),
                  Ce =
                    (Ve = de == null ? void 0 : de.cards) == null
                      ? void 0
                      : Ve.findIndex((F) => (F == null ? void 0 : F.id) === Qt),
                  Ue = y(h({}, w), { index: Kt });
                if (typeof Ce != 'number') return;
                const Jt =
                    w.droppableId === b.droppableId && w.index < b.index
                      ? Ce
                      : Ce + 1,
                  ze = y(h({}, b), { index: Jt });
                if (O && de && m) {
                  const F = et(m, Ue, ze);
                  F && v(F, O, de, Ue, ze, S, V);
                }
              }
              c(k);
            }
          },
          children: t(ht, {
            droppableId: 'workflowStates',
            direction: 'horizontal',
            type: 'workflowState',
            children: (b) =>
              t(
                $a,
                { isDragging: f, workflow: e, provided: b, cols: s },
                b.droppableProps['data-rbd-droppable-context-id'],
              ),
          }),
        }),
    ],
  });
}
function nt() {
  var A, B, E, R, b;
  const r = ((A = H().modalState) == null ? void 0 : A.formModalType)
      ? !1
      : 3e3,
    a = K(void 0, { refetchInterval: r }),
    o =
      (E = (B = a.data) == null ? void 0 : B.allWorkflows) == null
        ? void 0
        : E[0],
    [n, i] = U({ formModalType: 'addWorkflowState' }),
    [c, m] = U({ formModalType: 'editCard' }),
    [s, l] = U({ formModalType: 'editWorkflowState' }),
    [u, g] = U({ formModalType: 'addCard' }),
    [v, p] = U({ formModalType: 'addProject' }),
    [f, x] = U({ formModalType: 'editProject' }),
    N = ((R = a.data) == null ? void 0 : R.allProjects) || [],
    C =
      ((b = o == null ? void 0 : o.workflowStates) == null
        ? void 0
        : b
            .flatMap((w) => {
              var S;
              return (S = w == null ? void 0 : w.cards) == null
                ? void 0
                : S.map((k) => (k == null ? void 0 : k.id));
            })
            .filter(M)) || [],
    I = G(),
    j = async () => {
      var S;
      const w = await I.fetchQuery(
        _.getKey({ ids: le.uniq(C) }),
        _.fetcher({ ids: le.uniq(C) }),
        { staleTime: 1 / 0 },
      );
      (S = w == null ? void 0 : w.cardsByIds) == null ||
        S.forEach((k) => {
          !k || I.setQueryData(_.getKey({ ids: [k.id] }), { cardsByIds: [k] });
        });
    };
  return (
    D.exports.useEffect(() => {
      C.length > 0 && j();
    }, [JSON.stringify(C)]),
    d(J, {
      children: [
        a.isLoading && t('div', { children: 'Loading...' }),
        t(ba, { isOpen: !!n, handleClose: () => i(!1) }),
        t(ya, { isOpen: !!s, handleClose: () => l(!1) }),
        t(Fa, { isOpen: c, handleClose: () => m(!1) }),
        t(Sa, { isOpen: u, handleClose: () => g(!1) }),
        t(va, { isOpen: v, handleClose: () => p(!1) }),
        t(wa, { isOpen: f, handleClose: () => x(!1) }),
        t(aa, {
          navName: 'workflowProjectId',
          tabs: [...N, { id: '', name: 'All' }].filter(M).map((w) => ({
            id: w.id,
            name: w.name,
            count:
              (o == null
                ? void 0
                : o.workflowStates.reduce((S, k) => {
                    var W, L;
                    return (
                      S +
                      (((L =
                        (W = k == null ? void 0 : k.cards) == null
                          ? void 0
                          : W.filter((V) => {
                              var X, Y;
                              return w.id === ''
                                ? (X = V == null ? void 0 : V.project) == null
                                  ? void 0
                                  : X.id
                                : (w == null ? void 0 : w.id) &&
                                    ((Y = V == null ? void 0 : V.project) ==
                                    null
                                      ? void 0
                                      : Y.id) === w.id;
                            })) == null
                        ? void 0
                        : L.length) || 0)
                    );
                  }, 0)) || 0,
          })),
        }),
        o && t(Ba, { workflow: o }, o.id),
      ],
    })
  );
}
const Ea = new Hr(),
  Oa = new Wr(),
  La = document.getElementById('root');
$r.exports.render(
  d(Br, {
    client: Oa,
    children: [
      t(Er, {
        location: Ea,
        routes: [
          { path: '/site/_apps/kanban/index.html', element: t(nt, {}) },
          { path: '/site/_apps/kanban', element: t(nt, {}) },
        ],
        children: t(ct.exports.Worker, {
          workerUrl:
            'https://unpkg.com/pdfjs-dist@2.12.313/build/pdf.worker.min.js',
          children: t(Or, {}),
        }),
      }),
      t(Lr, {
        position: 'bottom-center',
        autoClose: 3e3,
        hideProgressBar: !1,
        newestOnTop: !1,
        closeOnClick: !0,
        rtl: !1,
        pauseOnFocusLoss: !0,
        draggable: !0,
        pauseOnHover: !0,
      }),
      t(Vr.exports.ReactQueryDevtools, { initialIsOpen: !1 }),
    ],
  }),
  La,
);
