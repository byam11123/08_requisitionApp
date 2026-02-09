import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
    Box,
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Alert,
    Stack,
    Divider
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import { authAPI } from '../services/api';

interface RegisterOrganizationForm {
    organizationName: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
    adminName: string;
    adminEmail: string;
    adminPassword: string;
}

const RegisterOrganization: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterOrganizationForm>();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (data: RegisterOrganizationForm) => {
        setLoading(true);
        setError('');
        try {
            // Use centralized API instance which goes through Nginx proxy
            const response = await authAPI.registerOrganization(data);
            navigate('/login', { state: { message: 'Organization registered! Please log in.' } });
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default',
                py: 4,
                px: 2
            }}
        >
            <Container maxWidth="sm" disableGutters>
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 3, sm: 5 },
                        borderRadius: 3,
                        border: '1px solid',
                        borderColor: 'divider',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                >
                    <Box sx={{ mb: 4, textAlign: 'center' }}>
                        <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
                            Get Started
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Register your organization and admin account
                        </Typography>
                    </Box>

                    {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack spacing={3}>
                            {/* Organization Section */}
                            <Box>
                                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <BusinessIcon color="primary" fontSize="small" /> Organization Details
                                </Typography>
                                <Stack spacing={2}>
                                    <TextField
                                        fullWidth
                                        label="Organization Name"
                                        placeholder="Acme Corp"
                                        {...register("organizationName", { required: "Required" })}
                                        error={!!errors.organizationName}
                                        helperText={errors.organizationName?.message}
                                    />
                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                        <TextField
                                            fullWidth
                                            label="Contact Email"
                                            type="email"
                                            {...register("contactEmail", { required: "Required" })}
                                        />
                                        <TextField
                                            fullWidth
                                            label="Phone Number"
                                            {...register("contactPhone")}
                                        />
                                    </Stack>
                                    <TextField
                                        fullWidth
                                        label="Address"
                                        multiline
                                        rows={2}
                                        {...register("address")}
                                    />
                                </Stack>
                            </Box>

                            <Divider />

                            {/* Admin Section */}
                            <Box>
                                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <PersonIcon color="primary" fontSize="small" /> Admin Account
                                </Typography>
                                <Stack spacing={2}>
                                    <TextField
                                        fullWidth
                                        label="Full Name"
                                        {...register("adminName", { required: "Required" })}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Admin Email (Login)"
                                        type="email"
                                        {...register("adminEmail", { required: "Required" })}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Password"
                                        type="password"
                                        {...register("adminPassword", {
                                            required: "Required",
                                            minLength: { value: 6, message: "Min 6 chars" }
                                        })}
                                        error={!!errors.adminPassword}
                                        helperText={errors.adminPassword?.message}
                                    />
                                </Stack>
                            </Box>

                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                type="submit"
                                disabled={loading}
                                sx={{ py: 1.5, mt: 2, fontSize: '1rem' }}
                            >
                                {loading ? 'Creating Account...' : 'Register Organization'}
                            </Button>
                        </Stack>
                    </form>

                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                        <Button
                            onClick={() => navigate('/login')}
                            sx={{ textTransform: 'none' }}
                        >
                            Return to Login
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default RegisterOrganization;
