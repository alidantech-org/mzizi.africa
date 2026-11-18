// Parsing boundary for comparison documents whose generated nested contracts are still open JSON.
import 'package:mzizi_api/api.dart';

Map<String, Object?> _map(Object? value) =>
    value is Map ? Map<String, Object?>.from(value) : const {};
String _text(Object? value) => value is String ? value : '';
double? _number(Object? value) => value is num ? value.toDouble() : null;

class ComparisonPlace {
  const ComparisonPlace(
    this.id,
    this.name,
    this.detail,
    this.distance,
    this.value,
  );
  final String id, name, detail;
  final double? distance, value;
  factory ComparisonPlace.parse(Object? raw) {
    final m = _map(raw);
    return ComparisonPlace(
      _text(m['featureId']),
      _text(m['name']),
      _text(m['detail']),
      _number(m['distanceKm']),
      _number(m['value']),
    );
  }
}

class ComparisonLevel {
  const ComparisonLevel(
    this.code,
    this.label,
    this.available,
    this.unit,
    this.message,
  );
  final String code, label, message;
  final bool available;
  final ComparisonPlace? unit;
  factory ComparisonLevel.parse(Object? raw) {
    final m = _map(raw);
    return ComparisonLevel(
      _text(m['rung']),
      _text(m['label']),
      m['available'] == true,
      m['unit'] == null ? null : ComparisonPlace.parse(m['unit']),
      _text(m['message']),
    );
  }
}

class ComparisonMetric {
  const ComparisonMetric(this.code, this.title, this.unit, this.description);
  final String code, title, unit, description;
  factory ComparisonMetric.parse(Object? raw) {
    final m = _map(raw);
    return ComparisonMetric(
      _text(m['code']),
      _text(m['title']),
      _text(m['unit']),
      _text(m['describe']),
    );
  }
}

class ComparisonOptions {
  ComparisonOptions(InsightsCompareOptions raw)
    : place = ComparisonPlace.parse(raw.place),
      nearby = raw.nearby.map(ComparisonPlace.parse).toList(),
      top = raw.top.map(ComparisonPlace.parse).toList(),
      levels = raw.hierarchy.map(ComparisonLevel.parse).toList(),
      metrics = raw.metrics.map(ComparisonMetric.parse).toList(),
      gaps = raw.gaps;
  final ComparisonPlace place;
  final List<ComparisonPlace> nearby, top;
  final List<ComparisonLevel> levels;
  final List<ComparisonMetric> metrics;
  final List<String> gaps;
}

class ComparisonRow {
  const ComparisonRow(
    this.title,
    this.unit,
    this.a,
    this.b,
    this.description,
    this.gap,
  );
  final String title, unit, description, gap;
  final double? a, b;
  factory ComparisonRow.parse(Object? raw) {
    final m = _map(raw), metric = _map(_map(raw)['metric']);
    return ComparisonRow(
      _text(m['title']).isEmpty ? _text(metric['title']) : _text(m['title']),
      _text(m['unit']).isEmpty ? _text(metric['unit']) : _text(m['unit']),
      _number(m['a']),
      _number(m['b']),
      _text(m['describe']),
      _text(m['gap']),
    );
  }
}

class ComparisonDocument {
  ComparisonDocument(InsightsComparison raw)
    : a = ComparisonPlace.parse(raw.a),
      b = ComparisonPlace.parse(raw.b),
      rows = raw.rows.map(ComparisonRow.parse).toList(),
      gaps = raw.gaps;
  final ComparisonPlace a, b;
  final List<ComparisonRow> rows;
  final List<String> gaps;
}
