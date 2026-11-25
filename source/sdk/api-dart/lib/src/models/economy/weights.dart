import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/economy/baskets.dart';
import 'package:mzizi_api/src/models/economy/goods.dart';
import 'package:mzizi_api/src/models/shared/association.dart';

part 'weights.g.dart';

/// A good's weight in a basket.
@JsonSerializable(includeIfNull: false)
class EconomyWeights {
  const EconomyWeights({
    required this.basketId,
    required this.createdAt,
    this.deletedAt,
    required this.goodId,
    required this.id,
    required this.weight,
  });
  final String basketId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String goodId;
  final String id;
  final double weight;

  factory EconomyWeights.fromJson(Map<String, dynamic> json) => _$EconomyWeightsFromJson(json);

  Map<String, dynamic> toJson() => _$EconomyWeightsToJson(this);
}
