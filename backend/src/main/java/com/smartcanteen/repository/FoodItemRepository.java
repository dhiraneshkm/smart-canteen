package com.smartcanteen.repository;

import com.smartcanteen.entity.FoodItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodItemRepository extends JpaRepository<FoodItem, Long> {

    List<FoodItem> findByAvailableTrue();

    @Query("SELECT f FROM FoodItem f WHERE f.available = true " +
           "AND (:categoryId IS NULL OR f.category.id = :categoryId) " +
           "AND (:isVegetarian IS NULL OR f.isVegetarian = :isVegetarian) " +
           "AND (:search IS NULL OR LOWER(f.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(f.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<FoodItem> searchItems(
            @Param("categoryId") Long categoryId,
            @Param("isVegetarian") Boolean isVegetarian,
            @Param("search") String search
    );

    @Modifying
    @Query("UPDATE FoodItem f SET f.stockQuantity = f.stockQuantity - :quantity WHERE f.id = :id AND f.stockQuantity >= :quantity")
    int decrementStockAtomic(@Param("id") Long id, @Param("quantity") int quantity);

    @Modifying
    @Query("UPDATE FoodItem f SET f.stockQuantity = f.stockQuantity + :quantity WHERE f.id = :id")
    int incrementStockAtomic(@Param("id") Long id, @Param("quantity") int quantity);
}
