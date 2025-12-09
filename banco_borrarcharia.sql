--
-- PostgreSQL database dump
--

\restrict g3HsL8jg26ap2vRihjqkdjdMnM16QZBL6QSffaphLxHFacoTwlwgI6V7ElOYMBO

-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.0

-- Started on 2025-12-08 23:46:55

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 900 (class 1247 OID 16924)
-- Name: enum_usuario_tipo_usuario; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_usuario_tipo_usuario AS ENUM (
    'Administrador',
    'Operador de Caixa'
);


ALTER TYPE public.enum_usuario_tipo_usuario OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 225 (class 1259 OID 16842)
-- Name: cliente; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cliente (
    id_cliente integer NOT NULL,
    nome_cliente character varying(100) NOT NULL
);


ALTER TABLE public.cliente OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16841)
-- Name: cliente_id_cliente_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cliente_id_cliente_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cliente_id_cliente_seq OWNER TO postgres;

--
-- TOC entry 5111 (class 0 OID 0)
-- Dependencies: 224
-- Name: cliente_id_cliente_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cliente_id_cliente_seq OWNED BY public.cliente.id_cliente;


--
-- TOC entry 233 (class 1259 OID 16885)
-- Name: despesa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.despesa (
    id_despesa integer NOT NULL,
    categoria character varying(50) NOT NULL,
    valor_despesa numeric(10,2) NOT NULL,
    data_despesa date NOT NULL,
    id_usuario integer,
    descricao_despesa character varying(255)
);


ALTER TABLE public.despesa OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 16884)
-- Name: despesa_id_despesa_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.despesa_id_despesa_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.despesa_id_despesa_seq OWNER TO postgres;

--
-- TOC entry 5112 (class 0 OID 0)
-- Dependencies: 232
-- Name: despesa_id_despesa_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.despesa_id_despesa_seq OWNED BY public.despesa.id_despesa;


--
-- TOC entry 237 (class 1259 OID 16911)
-- Name: item_venda; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.item_venda (
    id_item_venda integer NOT NULL,
    id_venda integer NOT NULL,
    id_servico integer,
    id_material integer,
    quantidade_servico integer CONSTRAINT item_venda_quantidade_not_null NOT NULL,
    valor_unitario_servico numeric(10,2) CONSTRAINT item_venda_valor_unitario_not_null NOT NULL
);


ALTER TABLE public.item_venda OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 16910)
-- Name: item_venda_id_item_venda_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.item_venda_id_item_venda_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.item_venda_id_item_venda_seq OWNER TO postgres;

--
-- TOC entry 5113 (class 0 OID 0)
-- Dependencies: 236
-- Name: item_venda_id_item_venda_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.item_venda_id_item_venda_seq OWNED BY public.item_venda.id_item_venda;


--
-- TOC entry 227 (class 1259 OID 16851)
-- Name: material; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.material (
    id_material integer NOT NULL,
    nome_material character varying(100) NOT NULL,
    descricao_material character varying(255),
    valor_material numeric(10,2) NOT NULL,
    quant_estoque integer NOT NULL
);


ALTER TABLE public.material OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16850)
-- Name: material_id_material_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.material_id_material_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.material_id_material_seq OWNER TO postgres;

--
-- TOC entry 5114 (class 0 OID 0)
-- Dependencies: 226
-- Name: material_id_material_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.material_id_material_seq OWNED BY public.material.id_material;


--
-- TOC entry 235 (class 1259 OID 16898)
-- Name: nota_fiscal; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.nota_fiscal (
    id_nota integer NOT NULL,
    data_emissao date NOT NULL,
    data_prevista_pagamento date,
    data_pagamento date,
    status_pagamento character varying(20) NOT NULL,
    id_venda integer NOT NULL,
    quantidade_servicos integer
);


ALTER TABLE public.nota_fiscal OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 16897)
-- Name: nota_fiscal_id_nota_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.nota_fiscal_id_nota_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.nota_fiscal_id_nota_seq OWNER TO postgres;

--
-- TOC entry 5115 (class 0 OID 0)
-- Dependencies: 234
-- Name: nota_fiscal_id_nota_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.nota_fiscal_id_nota_seq OWNED BY public.nota_fiscal.id_nota;


--
-- TOC entry 222 (class 1259 OID 16814)
-- Name: permissao; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permissao (
    id_permissao integer NOT NULL,
    descricao character varying(50) NOT NULL
);


ALTER TABLE public.permissao OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16813)
-- Name: permissao_id_permissao_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.permissao_id_permissao_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.permissao_id_permissao_seq OWNER TO postgres;

--
-- TOC entry 5116 (class 0 OID 0)
-- Dependencies: 221
-- Name: permissao_id_permissao_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.permissao_id_permissao_seq OWNED BY public.permissao.id_permissao;


--
-- TOC entry 229 (class 1259 OID 16862)
-- Name: servico; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.servico (
    id_servico integer NOT NULL,
    nome_servico character varying(100) NOT NULL,
    valor_servico numeric(10,2) NOT NULL
);


ALTER TABLE public.servico OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16861)
-- Name: servico_id_servico_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.servico_id_servico_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.servico_id_servico_seq OWNER TO postgres;

--
-- TOC entry 5117 (class 0 OID 0)
-- Dependencies: 228
-- Name: servico_id_servico_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.servico_id_servico_seq OWNED BY public.servico.id_servico;


--
-- TOC entry 220 (class 1259 OID 16800)
-- Name: usuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuario (
    id_usuario integer NOT NULL,
    nome_completo character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    senha character varying(100) NOT NULL,
    tipo_usuario character varying(20) NOT NULL
);


ALTER TABLE public.usuario OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16799)
-- Name: usuario_id_usuario_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuario_id_usuario_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuario_id_usuario_seq OWNER TO postgres;

--
-- TOC entry 5118 (class 0 OID 0)
-- Dependencies: 219
-- Name: usuario_id_usuario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuario_id_usuario_seq OWNED BY public.usuario.id_usuario;


--
-- TOC entry 223 (class 1259 OID 16824)
-- Name: usuario_permissao; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuario_permissao (
    id_usuario integer NOT NULL,
    id_permissao integer NOT NULL
);


ALTER TABLE public.usuario_permissao OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16872)
-- Name: venda; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.venda (
    id_venda integer NOT NULL,
    data_venda date NOT NULL,
    forma_pagamento character varying(20) NOT NULL,
    status_pagamento character varying(20) NOT NULL,
    id_usuario integer NOT NULL,
    id_cliente integer,
    metodo_pagamento character varying(50),
    total_venda numeric(10,2)
);


ALTER TABLE public.venda OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 16871)
-- Name: venda_id_venda_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.venda_id_venda_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.venda_id_venda_seq OWNER TO postgres;

--
-- TOC entry 5119 (class 0 OID 0)
-- Dependencies: 230
-- Name: venda_id_venda_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.venda_id_venda_seq OWNED BY public.venda.id_venda;


--
-- TOC entry 4905 (class 2604 OID 16845)
-- Name: cliente id_cliente; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente ALTER COLUMN id_cliente SET DEFAULT nextval('public.cliente_id_cliente_seq'::regclass);


--
-- TOC entry 4909 (class 2604 OID 16888)
-- Name: despesa id_despesa; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.despesa ALTER COLUMN id_despesa SET DEFAULT nextval('public.despesa_id_despesa_seq'::regclass);


--
-- TOC entry 4911 (class 2604 OID 16914)
-- Name: item_venda id_item_venda; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_venda ALTER COLUMN id_item_venda SET DEFAULT nextval('public.item_venda_id_item_venda_seq'::regclass);


--
-- TOC entry 4906 (class 2604 OID 16854)
-- Name: material id_material; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.material ALTER COLUMN id_material SET DEFAULT nextval('public.material_id_material_seq'::regclass);


--
-- TOC entry 4910 (class 2604 OID 16901)
-- Name: nota_fiscal id_nota; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_fiscal ALTER COLUMN id_nota SET DEFAULT nextval('public.nota_fiscal_id_nota_seq'::regclass);


--
-- TOC entry 4904 (class 2604 OID 16817)
-- Name: permissao id_permissao; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissao ALTER COLUMN id_permissao SET DEFAULT nextval('public.permissao_id_permissao_seq'::regclass);


--
-- TOC entry 4907 (class 2604 OID 16865)
-- Name: servico id_servico; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.servico ALTER COLUMN id_servico SET DEFAULT nextval('public.servico_id_servico_seq'::regclass);


--
-- TOC entry 4903 (class 2604 OID 16803)
-- Name: usuario id_usuario; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario ALTER COLUMN id_usuario SET DEFAULT nextval('public.usuario_id_usuario_seq'::regclass);


--
-- TOC entry 4908 (class 2604 OID 16875)
-- Name: venda id_venda; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.venda ALTER COLUMN id_venda SET DEFAULT nextval('public.venda_id_venda_seq'::regclass);


--
-- TOC entry 4923 (class 2606 OID 16849)
-- Name: cliente cliente_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT cliente_pkey PRIMARY KEY (id_cliente);


--
-- TOC entry 4931 (class 2606 OID 16896)
-- Name: despesa despesa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.despesa
    ADD CONSTRAINT despesa_pkey PRIMARY KEY (id_despesa);


--
-- TOC entry 4937 (class 2606 OID 16920)
-- Name: item_venda item_venda_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_venda
    ADD CONSTRAINT item_venda_pkey PRIMARY KEY (id_item_venda);


--
-- TOC entry 4925 (class 2606 OID 16860)
-- Name: material material_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.material
    ADD CONSTRAINT material_pkey PRIMARY KEY (id_material);


--
-- TOC entry 4933 (class 2606 OID 16909)
-- Name: nota_fiscal nota_fiscal_id_venda_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_fiscal
    ADD CONSTRAINT nota_fiscal_id_venda_key UNIQUE (id_venda);


--
-- TOC entry 4935 (class 2606 OID 16907)
-- Name: nota_fiscal nota_fiscal_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nota_fiscal
    ADD CONSTRAINT nota_fiscal_pkey PRIMARY KEY (id_nota);


--
-- TOC entry 4917 (class 2606 OID 16823)
-- Name: permissao permissao_descricao_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissao
    ADD CONSTRAINT permissao_descricao_key UNIQUE (descricao);


--
-- TOC entry 4919 (class 2606 OID 16821)
-- Name: permissao permissao_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissao
    ADD CONSTRAINT permissao_pkey PRIMARY KEY (id_permissao);


--
-- TOC entry 4927 (class 2606 OID 16870)
-- Name: servico servico_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.servico
    ADD CONSTRAINT servico_pkey PRIMARY KEY (id_servico);


--
-- TOC entry 4913 (class 2606 OID 16812)
-- Name: usuario usuario_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_email_key UNIQUE (email);


--
-- TOC entry 4921 (class 2606 OID 16830)
-- Name: usuario_permissao usuario_permissao_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_permissao
    ADD CONSTRAINT usuario_permissao_pkey PRIMARY KEY (id_usuario, id_permissao);


--
-- TOC entry 4915 (class 2606 OID 16810)
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id_usuario);


--
-- TOC entry 4929 (class 2606 OID 16883)
-- Name: venda venda_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.venda
    ADD CONSTRAINT venda_pkey PRIMARY KEY (id_venda);


--
-- TOC entry 4938 (class 2606 OID 16836)
-- Name: usuario_permissao usuario_permissao_id_permissao_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_permissao
    ADD CONSTRAINT usuario_permissao_id_permissao_fkey FOREIGN KEY (id_permissao) REFERENCES public.permissao(id_permissao) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4939 (class 2606 OID 16831)
-- Name: usuario_permissao usuario_permissao_id_usuario_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario_permissao
    ADD CONSTRAINT usuario_permissao_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.usuario(id_usuario) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2025-12-08 23:46:56

--
-- PostgreSQL database dump complete
--

\unrestrict g3HsL8jg26ap2vRihjqkdjdMnM16QZBL6QSffaphLxHFacoTwlwgI6V7ElOYMBO

