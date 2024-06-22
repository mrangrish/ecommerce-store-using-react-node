import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import SideNavbar from './SideNavbar';
import { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsCart } from 'react-icons/bs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import './style.css';
import axios from 'axios';

function Dashboard({userId, setUserId}) {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [productCount, setProductCount] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);

  const toggleSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const data = [
    { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
    { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
    { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
    { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
  ];

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const productResponse = await axios.get('http://localhost:8081/adminDashboard/productcount');
        setProductCount(productResponse.data.count);

        const customerResponse = await axios.get('http://localhost:8081/adminDashboard/userscount');
        setCustomerCount(customerResponse.data.count);
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };
    fetchCounts();
  }, []);

  return (
    <div className='grid-container'>
      <Header toggleSidebar={toggleSidebar} userId={userId} setUserId={setUserId}/>
      <SideNavbar openSidebarToggle={openSidebarToggle} toggleSidebar={toggleSidebar} userId={userId} setUserId={setUserId} />
      <main className='main-container-dash'>
        <div className='main-title'>
          <h3>DASHBOARD</h3>
        </div>

        <div className='main-cards'>
          <div className='card-dash'>
            <div className='card-inner'>
              <h4 className='card-title-name'>Product</h4>
              <BsFillArchiveFill className='card_icon' />
            </div>
            <h2 style={{fontSize: "42px"}}>{productCount}</h2>
          </div>
          <div className='card-dash'>
            <div className='card-inner'>
              <h4 className='card-title-name'>Orders</h4>
              <BsFillGrid3X3GapFill className='card_icon' />
            </div>
            <h2 style={{fontSize: "42px"}}>12</h2>
          </div>
          <div className='card-dash'>
            <div className='card-inner'>
              <h4 className='card-title-name'>Customer</h4>
              <BsPeopleFill className='card_icon' />
            </div>
            <h2 style={{fontSize: "42px"}}>{customerCount}</h2>
          </div>
          <div className='card-dash'>
            <div className='card-inner'>
              <h4 className='card-title-name'>Add to cart</h4>
              <BsCart className='card_icon' />
            </div>
            <h2 style={{fontSize: "42px"}}>42</h2>
          </div>
        </div>
        <div className='charts'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart
              width={500}
              height={300}
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey='pv' fill='#8884d8' />
              <Bar dataKey='uv' fill='#82ca9d' />
            </BarChart>
          </ResponsiveContainer>
          <ResponsiveContainer width='100%' height='100%'>
            <LineChart
              width={500}
              height={300}
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type='monotone' dataKey='pv' stroke='#8884d8' activeDot={{ r: 8 }} />
              <Line type='monotone' dataKey='uv' stroke='#82ca9d' />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;