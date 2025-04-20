import React, { useState } from 'react';
import { Button } from '..';
import { BsCheckLg } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSubscribeUserMutation } from '../../features/user/userApiSlice';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../features/auth/authSlice';

const SubscribeCard = ({
  title,
  icon,
  price,
  subtitle,
  features,
  featureTitle,
  btnText,
  link,
}) => {
  const [subscribeUser] = useSubscribeUserMutation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!title || !btnText) return; // Safety check
    if (title === 'Pro' && btnText === 'Get started') {
      setLoading(true);
      try {
        const response = await subscribeUser().unwrap();
        const { url, accessToken } = response;
        if (accessToken) dispatch(setCredentials({ accessToken }));
        window.location.href = url; // Redirect to Stripe Checkout
      } catch (error) {
        toast.error(error.data?.message || 'Subscription failed');
        console.error('Subscription error:', error);
      } finally {
        setLoading(false);
      }
    } else if (link) {
      window.location.href = link; // Redirect for non-subscription buttons
    }
  };

  return (
    <div className="flex flex-col items-center md:items-start gap-1 shadow bg-white rounded-lg p-8 hover:shadow-lg w-full">
      <div className="flex gap-3 items-center">
        {icon}
        <h3 className="font-bold text-xl">{title}</h3>
      </div>
      <p className="text-gray-500 text-sm">{subtitle}</p>
      <h4 className="font-bold text-3xl my-4">{price}</h4>
      {link ? (
        <Link to={link} className="w-full">
          <Button
            content={btnText}
            customCss={"rounded text-sm w-full"}
          />
        </Link>
      ) : (
        <Button
          content={btnText}
          handleClick={handleClick}
          customCss={"rounded text-sm w-full"}
          disabled={loading}
        />
      )}
      <div className="flex gap-2 flex-col mt-4">
        <h4 className="font-bold">{featureTitle}</h4>
        <ul className="flex flex-col gap-2">
          {features?.map((feature) => (
            <li className="flex gap-2 items-center" key={feature}>
              <BsCheckLg className="text-primary" />
              <span className="text-gray-500 text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SubscribeCard;