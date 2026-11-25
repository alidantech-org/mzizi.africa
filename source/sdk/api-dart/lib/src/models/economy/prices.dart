import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/economy/price_kind.dart';
import 'package:mzizi_api/src/enums/shared/figure_basis.dart';
import 'package:mzizi_api/src/enums/shared/figure_status.dart';
import 'package:mzizi_api/src/models/economy/goods.dart';
import 'package:mzizi_api/src/models/geography/features.dart';
import 'package:mzizi_api/src/models/reference/countries.dart';
import 'package:mzizi_api/src/models/reference/currencies.dart';
import 'package:mzizi_api/src/models/shared/partitioned_entity.dart';
import 'package:mzizi_api/src/models/statistics/collections.dart';

part 'prices.g.dart';

/// One observed, reference or modelled price of a good at a place and time.
@JsonSerializable(includeIfNull: false)
class EconomyPrices {
  const EconomyPrices({
    this.amount,
    required this.basis,
    this.collectionId,
    required this.countryId,
    required this.createdAt,
    required this.currencyId,
    this.deletedAt,
    this.endsOn,
    this.featureId,
    this.fromYear,
    required this.goodId,
    required this.id,
    required this.kind,
    required this.revision,
    this.startsOn,
    required this.status,
    this.supersedesId,
    this.toYear,
    required this.updatedAt,
    required this.version,
  });
  final int? amount;
  final SharedFigureBasis basis;
  final String? collectionId;
  final String countryId;
  final DateTime createdAt;
  final String currencyId;
  final DateTime? deletedAt;
  final DateTime? endsOn;
  final String? featureId;
  final int? fromYear;
  final String goodId;
  final String id;
  final EconomyPriceKind kind;
  final int revision;
  final DateTime? startsOn;
  final SharedFigureStatus status;
  final String? supersedesId;
  final int? toYear;
  final DateTime updatedAt;
  final int version;

  factory EconomyPrices.fromJson(Map<String, dynamic> json) => _$EconomyPricesFromJson(json);

  Map<String, dynamic> toJson() => _$EconomyPricesToJson(this);
}
