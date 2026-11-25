import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/economy/goods.dart';
import 'package:mzizi_api/src/models/reference/units.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';

part 'compositions.g.dart';

/// What a works item is made of: a bill of quantities.
@JsonSerializable(includeIfNull: false)
class EconomyCompositions {
  const EconomyCompositions({
    required this.createdAt,
    this.deletedAt,
    required this.goodId,
    required this.id,
    required this.inputId,
    required this.quantity,
    required this.unitId,
    required this.updatedAt,
    required this.version,
  });
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String goodId;
  final String id;
  final String inputId;
  final double quantity;
  final String unitId;
  final DateTime updatedAt;
  final int version;

  factory EconomyCompositions.fromJson(Map<String, dynamic> json) => _$EconomyCompositionsFromJson(json);

  Map<String, dynamic> toJson() => _$EconomyCompositionsToJson(this);
}
