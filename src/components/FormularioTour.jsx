import React, { useState, useEffect } from "react";
import { supabase } from "../../backend/supabaseClient";
import { User, Phone, Calendar, Users, MapPin, AlertCircle, FileText, CheckCircle } from "lucide-react";

const FormularioTour = ({ tour, onSubmitedSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        nombre: "",
        apellidos: ""
        documento: "",
        whatsapp: "",
        fecha_tour: "",
        adultos: 1,
        ninos: 0,
        alergias: "",
        observaciones: ""
    });

    const [total, setTotal] = useState(tour?.precio || 0);

    useEffect(() => {
        const cuposTotales = parseInt(formData.adultos || 0) + parseInt(formData.ninos || 0);
        setTotal(cuposTotales * (tour?.precio || 0));
    }
    )
}