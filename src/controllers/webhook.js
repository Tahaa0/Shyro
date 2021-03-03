exports.listen = async (req, res) => {
    try {
        console.log(req.body) // Call your action on the request here
        res.status(200).end() // Responding is important
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};