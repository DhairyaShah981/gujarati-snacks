import User from '../models/User.js';

export const addAddress = async (req, res) => {
  try {
    const { street, city, state, zipCode, isDefault } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If this is the first address or isDefault is true, set it as default
    const shouldBeDefault = isDefault || user.addresses.length === 0;

    // If this address is set as default, update all other addresses to not be default
    if (shouldBeDefault) {
      user.addresses.forEach(address => {
        address.isDefault = false;
      });
    }

    // Add the new address
    user.addresses.push({
      street,
      city,
      state,
      zipCode,
      isDefault: shouldBeDefault,
    });

    await user.save();

    res.status(201).json({
      message: 'Address added successfully',
      address: user.addresses[user.addresses.length - 1],
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding address', error: error.message });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const { street, city, state, zipCode, isDefault } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the address index
    const addressIndex = user.addresses.findIndex(
      (addr) => addr._id.toString() === addressId
    );

    if (addressIndex === -1) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // If this address is being set as default, update all other addresses
    if (isDefault) {
      user.addresses.forEach(address => {
        address.isDefault = false;
      });
    }

    // Update the address
    user.addresses[addressIndex] = {
      ...user.addresses[addressIndex],
      street,
      city,
      state,
      zipCode,
      isDefault: isDefault || user.addresses[addressIndex].isDefault,
    };

    await user.save();

    res.json({
      message: 'Address updated successfully',
      address: user.addresses[addressIndex],
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating address', error: error.message });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the address index
    const addressIndex = user.addresses.findIndex(
      (addr) => addr._id.toString() === addressId
    );

    if (addressIndex === -1) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // Check if the address being deleted is the default one
    const isDefaultAddress = user.addresses[addressIndex].isDefault;

    // Remove the address
    user.addresses.splice(addressIndex, 1);

    // If we deleted the default address and there are other addresses, set the first one as default
    if (isDefaultAddress && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting address', error: error.message });
  }
};

export const setDefaultAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the address index
    const addressIndex = user.addresses.findIndex(
      (addr) => addr._id.toString() === addressId
    );

    if (addressIndex === -1) {
      return res.status(404).json({ message: 'Address not found' });
    }

    // Set all addresses to not default
    user.addresses.forEach(address => {
      address.isDefault = false;
    });

    // Set the selected address as default
    user.addresses[addressIndex].isDefault = true;

    await user.save();

    res.json({
      message: 'Default address updated successfully',
      address: user.addresses[addressIndex],
    });
  } catch (error) {
    res.status(500).json({ message: 'Error setting default address', error: error.message });
  }
}; 