import express from 'express';
import User from '../models/user.model';
import { authMiddleware } from '../middlewares';
import { Types } from 'mongoose';
import { UserDomain } from '../models/domain/user-domain.model';

const router = express.Router();

// GET current user
router.get<{}>('/me', authMiddleware, async (req, res) => {
  try {
    const userDomain: UserDomain = new UserDomain(req.user);
    
    const user = await User.findById(userDomain._id);

    if (user) {
      return res.status(200).send(user);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET all
router.get('/', async (req, res) => {
  try {
    const user = await User.find({});

    if (user) {
      return res.status(200).send(user);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET user by Id
router.get<{ id: Types.ObjectId }>('/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.find({ _id: userId });

    if (user) {
      return res.status(200).send(user);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { email, firstName, lastName, roles } = req.body;

  try {
    const updatedUser = await User.findById(id);    

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    updatedUser.email = email;
    updatedUser.firstName = firstName;
    updatedUser.lastName = lastName;
    //updatedUser.roles = roles;

    updatedUser.save();
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE a user by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRole = await User.findByIdAndDelete(id);

    if (!deletedRole) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
