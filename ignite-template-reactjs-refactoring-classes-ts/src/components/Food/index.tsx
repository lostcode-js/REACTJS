import { FiEdit3, FiTrash } from 'react-icons/fi';

import { Container } from './styles';
import api from '../../services/api';
import { useEffect, useState } from 'react';

interface FoodInterface {
  id: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
  image: string;
}

interface FoodProps {
  food: FoodInterface;
  handleEditFood: (arg: FoodInterface) => void;
  handleDelete: (arg: number) => void;
}

function Food ({ food,  handleEditFood, handleDelete }: FoodProps) {
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    const { available } = food;
    setIsAvailable(available);
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggleAvailable = async () => {
    const updatedFood =  {...food};

    await api.put(`/foods/${updatedFood.id}`, {
      ...updatedFood,
      available: !isAvailable,
    });

    setIsAvailable(!isAvailable);
  }

  const setEditingFood = () => {
    handleEditFood(food);
  }

    return (
      <Container available={isAvailable}>
        <header>
          <img src={food.image} alt={food.name} />
        </header>
        <section className="body">
          <h2>{food.name}</h2>
          <p>{food.description}</p>
          <p className="price">
            R$ <b>{food.price}</b>
          </p>
        </section>
        <section className="footer">
          <div className="icon-container">
            <button
              type="button"
              className="icon"
              onClick={setEditingFood}
              data-testid={`edit-food-${food.id}`}
            >
              <FiEdit3 size={20} />
            </button>

            <button
              type="button"
              className="icon"
              onClick={() => handleDelete(food.id)}
              data-testid={`remove-food-${food.id}`}
            >
              <FiTrash size={20} />
            </button>
          </div>

          <div className="availability-container">
            <p>{isAvailable ? 'Disponível' : 'Indisponível'}</p>

            <label htmlFor={`available-switch-${food.id}`} className="switch">
              <input
                id={`available-switch-${food.id}`}
                type="checkbox"
                checked={isAvailable}
                onChange={toggleAvailable}
                data-testid={`change-status-food-${food.id}`}
              />
              <span className="slider" />
            </label>
          </div>
        </section>
      </Container>
    );
  }


export default Food;
