import { useEffect, useState } from 'react';
import JobCard from '../Components/JobCard';
import SearchBar from '../Components/SearchBar';
import ThemeToggle from '../Components/ThemeToggle';
import TopCompanies from '../Components/TopCompanies';
import { useJobs } from '../Hook/useJob';
import api from '../api/axios';
import './Home.css';
import logo from './logo.png';

const Home = () => {
  const {
    jobs,
    allFiltered,
    filtered,
    loading,
    filterJobs,
    nextPage,
    prevPage,
    page,
    totalPages,
  } = useJobs();

  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const resetForm = () => {
    setEmail('');
    setPassword('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      alert('Login successful!');
      setShowLogin(false);
      resetForm();
    } catch (err) {
      alert('Login failed');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/signup', { email, password });
      alert('Signup successful! You can now login.');
      setShowSignup(false);
      resetForm();
    } catch (err) {
      alert('Signup failed');
    }
  };

  if (loading) return <p>Loading jobs...</p>;

  return (
    <>
      <div className="top-bar">
        <div className="nav-left">
          <img src={logo} alt="JobFinder Logo" className="logo-img" />
        </div>
        <div className="nav-center">
          <SearchBar onSearch={filterJobs} />
        </div>
        <div className="nav-right">
          <button className="auth-btn" onClick={() => setShowLogin(true)}>Login</button>
          <button className="auth-btn" onClick={() => setShowSignup(true)}>Sign Up</button>
          <ThemeToggle />
          
        </div>
      </div>

      <div className="content">
        {filtered && (
          <div className="search-section">
            <h2>Search Result</h2>
            {allFiltered.length === 0
              ? <p>No matched found</p>
              : <div className="home">{jobs.map(job => <JobCard key={job.id} job={job} />)}</div>}
          </div>
        )}
        <TopCompanies />
        <h2 className="section-title">Featured Jobs</h2>
        <div className="home">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
        <div className="pagination">
          <button disabled={page === 1} onClick={prevPage}>Previous</button>
          <span>Page {page} of {totalPages}</span>
          <button disabled={page === totalPages} onClick={nextPage}>Next</button>
        </div>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div className="modal">
          <form onSubmit={handleLogin} className="auth-form">
            <h2>Login</h2>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
            <button type="submit">Login</button>
            <button type="button" onClick={() => setShowLogin(false)}>Cancel</button>
          </form>
        </div>
      )}

      {/* Signup Modal */}
      {showSignup && (
        <div className="modal">
          <form onSubmit={handleSignup} className="auth-form">
            <h2>Sign Up</h2>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
            <button type="submit">Sign Up</button>
            <button type="button" onClick={() => setShowSignup(false)}>Cancel</button>
          </form>
        </div>
      )}
    </>
  );
};

export default Home;
