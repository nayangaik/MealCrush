import AddressModel from '../models/address.model.js'

export const addAddress = async (request, response) => {
    try {
        const { address_line, city, state, country, pincode, mobile } = request.body
        const userId = request.user.id

        if (!address_line || !city || !state || !country || !pincode || !mobile) {
            return response.status(400).json({
                message: "All fields are required",
                error: true,
                success: false
            })
        }

        const address = new AddressModel({
            userId: userId,
            address_line: address_line,
            city: city,
            state: state,
            country: country,
            pincode: pincode,
            mobile: mobile,
            status: true
        })

        const savedAddress = await address.save()

        return response.json({
            message: "Address added successfully",
            data: savedAddress,
            error: false,
            success: true
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            success: false,
            error: true
        })
    }
}

export const getAddresses = async (request, response) => {
    try {
        const userId = request.user.id

        const addresses = await AddressModel.find({ userId: userId, status: true })

        return response.json({
            message: "Addresses retrieved successfully",
            data: addresses,
            error: false,
            success: true
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            success: false,
            error: true
        })
    }
}

export const updateAddress = async (request, response) => {
    try {
        const { _id, address_line, city, state, country, pincode, mobile } = request.body
        const userId = request.user.id

        if (!_id) {
            return response.status(400).json({
                message: "Address ID is required",
                error: true,
                success: false
            })
        }

        const address = await AddressModel.findOne({ _id: _id, userId: userId })
        if (!address) {
            return response.status(404).json({
                message: "Address not found",
                error: true,
                success: false
            })
        }

        const updateData = {}
        if (address_line) updateData.address_line = address_line
        if (city) updateData.city = city
        if (state) updateData.state = state
        if (country) updateData.country = country
        if (pincode) updateData.pincode = pincode
        if (mobile) updateData.mobile = mobile

        const updatedAddress = await AddressModel.findByIdAndUpdate(
            _id,
            updateData,
            { new: true }
        )

        return response.json({
            message: "Address updated successfully",
            data: updatedAddress,
            error: false,
            success: true
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            success: false,
            error: true
        })
    }
}

export const deleteAddress = async (request, response) => {
    try {
        const { _id } = request.body
        const userId = request.user.id

        if (!_id) {
            return response.status(400).json({
                message: "Address ID is required",
                error: true,
                success: false
            })
        }

        const address = await AddressModel.findOne({ _id: _id, userId: userId })
        if (!address) {
            return response.status(404).json({
                message: "Address not found",
                error: true,
                success: false
            })
        }

        // Soft delete by setting status to false
        await AddressModel.findByIdAndUpdate(_id, { status: false })

        return response.json({
            message: "Address deleted successfully",
            error: false,
            success: true
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            success: false,
            error: true
        })
    }
}
