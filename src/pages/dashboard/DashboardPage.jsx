// ... imports existentes
import AboutSeduc from './AboutSeduc'; // 1. Importe a nova página

const DashboardPage = () => {
  // ... hooks e props

  return (
    <>
      <Routes>
        <Route element={<DashboardLayout />}>
          {/* ... outras rotas ... */}
          
          <Route path="ferramentas" element={<FerramentasComponent onContactSupport={handleContactSupport} />} />
          <Route path="configuracoes" element={<SettingsComponent user={user} />} />
          
          {/* 2. Nova Rota */}
          <Route path="sobre-seduc" element={<AboutSeduc />} />

          {/* ... */}
        </Route>
      </Routes>
      {/* ... */}
    </>
  );
};
