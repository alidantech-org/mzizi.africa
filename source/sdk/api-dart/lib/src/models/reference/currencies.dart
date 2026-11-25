import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/identity_kind.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/shared/identity_entity.dart';

part 'currencies.g.dart';

/// A currency with its ISO codes and minor units; currencies end and are replaced.
@JsonSerializable(includeIfNull: false)
class ReferenceCurrencies {
  const ReferenceCurrencies({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    this.fromYear,
    required this.id,
    required this.identityKind,
    this.isoCode,
    this.isoNumeric,
    required this.minorUnits,
    this.replacedById,
    this.symbol,
    this.toYear,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final int? fromYear;
  final String id;
  final SharedIdentityKind identityKind;
  final String? isoCode;
  final String? isoNumeric;
  final int minorUnits;
  final String? replacedById;
  final String? symbol;
  final int? toYear;
  final DateTime updatedAt;
  final int version;

  factory ReferenceCurrencies.fromJson(Map<String, dynamic> json) => _$ReferenceCurrenciesFromJson(json);

  Map<String, dynamic> toJson() => _$ReferenceCurrenciesToJson(this);
}
