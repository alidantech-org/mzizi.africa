import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/economy/crosswalk_kind.dart';
import 'package:mzizi_api/src/models/shared/association.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'crosswalks.g.dart';

/// Official correspondence tables between classifications (UN CPC to COICOP, HS).
@JsonSerializable(includeIfNull: false)
class EconomyCrosswalks {
  const EconomyCrosswalks({
    required this.createdAt,
    this.deletedAt,
    required this.fromSchemeTerm,
    required this.fromValue,
    required this.id,
    required this.kind,
    required this.toSchemeTerm,
    required this.toValue,
  });
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String fromSchemeTerm;
  final String fromValue;
  final String id;
  final EconomyCrosswalkKind kind;
  final String toSchemeTerm;
  final String toValue;

  factory EconomyCrosswalks.fromJson(Map<String, dynamic> json) => _$EconomyCrosswalksFromJson(json);

  Map<String, dynamic> toJson() => _$EconomyCrosswalksToJson(this);
}
