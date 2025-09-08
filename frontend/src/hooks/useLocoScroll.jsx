// src/hooks/useLocoScroll.js
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import LocomotiveScroll from "locomotive-scroll";

export default function useLocoScroll(loading) {
  const scrollRef  = useRef(null);
  const locoScroll = useRef(null);
  const { pathname } = useLocation();

  // initialize once loading is done
  useEffect(() => {
    if (loading || !scrollRef.current) return;
    requestAnimationFrame(() => {
      locoScroll.current = new LocomotiveScroll({
        el: scrollRef.current,
        smooth: true,
      });
    });
    return () => locoScroll.current?.destroy();
  }, [loading]);

  // update on route change
  useEffect(() => {
    if (locoScroll.current) {
      locoScroll.current.scrollTo(0, { duration: 0 });
      locoScroll.current.update();
    }
  }, [pathname]);

  // update on resize
  useEffect(() => {
    const onResize = () => locoScroll.current?.update();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // expose both the ref and the loco instance
  return { scrollRef, loco: locoScroll.current };
}
