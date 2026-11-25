import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/economy/good_kind.dart';
import 'package:mzizi_api/src/enums/economy/good_status.dart';
import 'package:mzizi_api/src/models/reference/units.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'goods.g.dart';

/// The catalogue of goods, services and works ("Cement, 50 kg bag, grade 42.5N").
@JsonSerializable(includeIfNull: false)
class EconomyGoods {
  const EconomyGoods({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.kind,
    this.parentId,
    this.size,
    this.sizeUnitId,
    this.standardTerm,
    required this.status,
    this.unitId,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final EconomyGoodKind kind;
  final String? parentId;
  final double? size;
  final String? sizeUnitId;
  final String? standardTerm;
  final EconomyGoodStatus status;
  final String? unitId;
  final DateTime updatedAt;
  final int version;

  factory EconomyGoods.fromJson(Map<String, dynamic> json) => _$EconomyGoodsFromJson(json);

  Map<String, dynamic> toJson() => _$EconomyGoodsToJson(this);
}
