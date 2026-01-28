import React, { useState, useEffect } from 'react';
import { habitApi } from '../../api/habit.api';
import Card, { CardContent, CardHeader, CardTitle } from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { Plus, Check, Flame } from 'lucide-react';
import toast from 'react-hot-toast';

const Habits = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newHabit, setNewHabit] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const fetchData = async () => {
    try {
      const response = await habitApi.getAll();
      if (response.success) {
        setHabits(response.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newHabit.trim()) return;
    try {
      const response = await habitApi.create(newHabit);
      if (response.success) {
        toast.success('Habit created');
        setNewHabit('');
        setIsAdding(false);
        fetchData();
      }
    } catch (error) {
      toast.error('Failed to create habit');
    }
  };

  const handleMark = async (id) => {
    try {
      const response = await habitApi.mark(id);
      if (response.success) {
        toast.success('Habit completed for today!');
        fetchData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mark habit');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Habit Tracker</h1>
           <p className="text-gray-500">Build better habits, one day at a time</p>
        </div>
        <Button onClick={() => setIsAdding(!isAdding)}>
          <Plus className="w-4 h-4 mr-2" /> New Habit
        </Button>
      </div>

      {isAdding && (
        <Card className="items-center bg-gray-50">
          <CardContent className="pt-6">
            <form onSubmit={handleCreate} className="flex gap-2">
              <Input 
                 placeholder="Enter habit title (e.g. Read 30 mins)" 
                 value={newHabit}
                 onChange={(e) => setNewHabit(e.target.value)}
                 required
              />
              <Button type="submit">Create</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <p className="text-center text-gray-500">Loading habits...</p>
      ) : habits.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg border">
          <p className="text-gray-500">No habits tracked yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {habits.map((habit) => (
            <Card key={habit._id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg">{habit.title}</h3>
                  <div className="flex items-center text-orange-500 font-medium">
                    <Flame className="w-4 h-4 mr-1 fill-current" />
                    <span>{habit.streak || 0}</span>
                  </div>
                </div>
                
                {/* Check if completed today */}
                {habit.completedToday ? (
                  <div className="bg-green-100 text-green-700 py-2 rounded-lg flex items-center justify-center font-medium">
                    <Check className="w-5 h-5 mr-2" /> Done Today
                  </div>
                ) : (
                  <Button 
                    variant="secondary" 
                    className="w-full"
                    onClick={() => handleMark(habit._id)}
                  >
                    Mark Complete
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Habits;
