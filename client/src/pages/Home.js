

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InternshipCard from '../components/InternshipCard';

const Home = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    fetchInternships();
  }, [sort]);

  const fetchInternships = async () => {
    try {
      setLoading(true);
      let url = `https://find-jobs-9smp.onrender.com/api/internships?sort=${sort}`;

      if (location) {
        url += `&location=${location}`;
      }

      if (search) {
        url += `&search=${search}`;
      }

      const res = await axios.get(url);
      console.log("Fetched data:", res.data);
      setInternships(Array.isArray(res.data) ? res.data : []);

      setError(null);
    } catch (err) {
      setError('Failed to fetch internships');
      console.error('Error fetching internships:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchInternships();
  };

  const clearFilters = () => {
    setSearch('');
    setLocation('');
    setSort('newest');
    // Delay to wait for state update
    setTimeout(fetchInternships, 0);
  };


  return (
    <div className="home-page">
      <section className="hero">
        <div className="container">
          <h1>Find Your Dream Internship</h1>
          <p>Browse through hundreds of internship opportunities</p>
        </div>
      </section>

      <section className="search-section">
        <div className="container">
          <form onSubmit={handleSearch} className="search-form">
            <div className="form-group">
              <input
                type="text"
                placeholder="Search internships..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="form-group">
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
            <button type="submit" className="btn-primary">Search</button>
            <button type="button" className="btn-secondary" onClick={clearFilters}>Clear</button>
          </form>
        </div>
      </section>

      <section className="internships-section">
        <div className="container">
          <h2>Available Internships</h2>
          {loading ? (
            <p>Loading internships...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : internships.length === 0 ? (
            <p>No internships found. Try adjusting your search.</p>
          ) : (
            <div className="internships-grid">
              {Array.isArray(internships) && internships.length > 0 ? (
                <div className="internships-grid">
                  {internships.map((internship) => (
                    <InternshipCard key={internship._id} internship={internship} />
                  ))}
                </div>
              ) : (
                <p>No internships found. Try adjusting your search.</p>
              )}

            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;

