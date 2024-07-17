import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import norm

# Population Parameter
population_mean = 0
population_std = 1

# Stichproben Parameter
n = 100
standard_error = population_std / np.sqrt(n)

# x-Werte für die Verteilungen
x = np.linspace(-4, 4, 1000)

# Population Verteilung
population_pdf = norm.pdf(x, population_mean, population_std)

# Stichprobenmittelwert Verteilung
sample_mean_pdf = norm.pdf(x, population_mean, standard_error)

# Plot
plt.figure(figsize=(12, 6))

# Population
plt.plot(x, population_pdf, label='Population Verteilung ($\sigma = 1$)', color='blue')
plt.fill_between(x, population_pdf, alpha=0.2, color='blue')

# Stichprobenmittelwerte
plt.plot(x, sample_mean_pdf, label='Stichprobenmittelwert Verteilung ($SE = 0.1$)', color='green')
plt.fill_between(x, sample_mean_pdf, alpha=0.2, color='green')

# Markiere die Bereiche der Abweichungen
plt.axvline(0.1, color='red', linestyle='--', linewidth=1, label='Abweichung $\pm 0.1$')
plt.axvline(-0.1, color='red', linestyle='--', linewidth=1)

# Titel und Legende
plt.title('Verteilungen der Population und der Stichprobenmittelwerte')
plt.xlabel('Wert')
plt.ylabel('Dichte')
plt.legend()

plt.show()
