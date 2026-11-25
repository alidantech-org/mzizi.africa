import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/economy/goods.dart';
import 'package:mzizi_api/src/models/shared/association.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'codes.g.dart';

/// A good's code in an international classification; CPC is the pivot.
@JsonSerializable(includeIfNull: false)
class EconomyCodes {
  const EconomyCodes({
    required this.createdAt,
    this.deletedAt,
    required this.goodId,
    required this.id,
    required this.schemeTerm,
    required this.value,
  });
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String goodId;
  final String id;
  final String schemeTerm;
  final String value;

  factory EconomyCodes.fromJson(Map<String, dynamic> json) => _$EconomyCodesFromJson(json);

  Map<String, dynamic> toJson() => _$EconomyCodesToJson(this);
}
