import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import LocomotiveScroll from "locomotive-scroll";

export default function useLocoScroll(loading) {
  const scrollRef  = useRef(null);
  const locoScroll = useRef(null);
  const { pathname } = useLocation();

  // initialize
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

  // on route change scroll to top
  useEffect(() => {
    if (!locoScroll.current) return;

    requestAnimationFrame(() => {
      locoScroll.current.update();
      locoScroll.current.scrollTo(scrollRef.current, {
        offset: 0,
        duration: 0,
        disableLerp: true,
      });
    });
  }, [pathname]);

  // update on resize
  useEffect(() => {
    const onResize = () => locoScroll.current?.update();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return { scrollRef, loco: locoScroll.current };
}
