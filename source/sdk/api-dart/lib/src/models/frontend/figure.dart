import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/figure_basis.dart';
import 'package:mzizi_api/src/enums/shared/figure_status.dart';
import 'package:mzizi_api/src/models/shared/localized_text.dart';

part 'figure.g.dart';

/// Figure
@JsonSerializable(includeIfNull: false)
class FrontendFigure {
  const FrontendFigure({
    required this.basis,
    this.decimals,
    this.fromYear,
    required this.indicator,
    required this.label,
    this.lower,
    required this.status,
    this.toYear,
    this.unit,
    this.upper,
    this.value,
  });
  final SharedFigureBasis basis;
  final int? decimals;
  final int? fromYear;
  final String indicator;
  final SharedLocalizedText label;
  final double? lower;
  final SharedFigureStatus status;
  final int? toYear;
  final String? unit;
  final double? upper;
  final double? value;

  factory FrontendFigure.fromJson(Map<String, dynamic> json) => _$FrontendFigureFromJson(json);

  Map<String, dynamic> toJson() => _$FrontendFigureToJson(this);
}
