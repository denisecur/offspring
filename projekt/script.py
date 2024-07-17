import matplotlib.pyplot as plt
import scipy.stats as stats
import numpy as np

# Parameter der Normalverteilung\
mu = 500
sigma = 10
x = 550

# Standardisierung\
z = (x - mu) / sigma

# Wertebereich f\'fcr die x-Achse\
x_values = np.linspace(mu - 4*sigma, mu + 4*sigma, 1000)

# Dichtefunktion der Normalverteilung\
pdf = stats.norm.pdf(x_values, mu, sigma)

# Plot der Normalverteilungskurve\
plt.figure(figsize=(10, 6))
plt.plot(x_values, pdf, label='Normalverteilung')
plt.fill_between(x_values, pdf, where=(x_values <= x), color='skyblue', alpha=0.5, label='$P(X \\leq x)$')
plt.fill_between(x_values, pdf, where=(x_values >= x), color='lightcoral', alpha=0.5, label='$P(X \\geq x)$')

# Markierung des Punktes x\
plt.axvline(x, color='black', linestyle='--', label='$x = 550$')
plt.axvline(mu, color='grey', linestyle='--', label='$\\mu = 500$')

# Beschriftungen und Legende\
plt.title('Grafische Veranschaulichung der Regel')
plt.xlabel('Wert')
plt.ylabel('Dichte')
plt.legend()
# Anzeige des Plots\
plt.show()
