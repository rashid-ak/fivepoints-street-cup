import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AutoNavigate = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-navigate to admin diagnostics tab after build
    const timer = setTimeout(() => {
      navigate('/admin#diagnostics');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return null;
};