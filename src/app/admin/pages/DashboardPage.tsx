import styles from './styles.module.css';

interface DashboardPageProps {
  user: any;
}

export const DashboardPage = ({ user }: DashboardPageProps) => {
  return (
    <div className={styles.dashboardContainer}>
      <h1>Bem-vindo ao Painel Administrativo</h1>
      
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>Total de Usuários</h3>
          <p>1,024</p>
        </div>
        
        <div className={styles.statCard}>
          <h3>Cursos Ativos</h3>
          <p>56</p>
        </div>
        
        <div className={styles.statCard}>
          <h3>Novos Hoje</h3>
          <p>12</p>
        </div>
      </div>
      
      <div className={styles.recentActivity}>
        <h2>Atividade Recente</h2>
        <ul>
          <li>Novo usuário cadastrado - João Silva</li>
          <li>Curso "React Avançado" atualizado</li>
          <li>3 novos alunos matriculados hoje</li>
        </ul>
      </div>
    </div>
  );
};